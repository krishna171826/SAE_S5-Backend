import { geocodeAddress } from "./geoCodingService.js";
import { fetchActivities } from './overpassService.js';
import { saveActivitiesBatch } from "./activityService.js";
import { findNearbyActivities } from "../models/activityModel.js";
import { createSearchRecord } from "../models/searchModel.js";
import pool from "../db.js";

export async function processSearch({ address, radius, visitorId, indoor_outdoor }) {
  // 1. Transformer l'adresse en coordonnées GPS via ton geocodingService
  const { latitude, longitude } = await geocodeAddress(address);

  // 2. Interroger Overpass pour récupérer les lieux bruts autour de ces coordonnées
  const radiusMeters = parseFloat(radius) || 5000;
  const rawElements = await fetchActivities(latitude, longitude, radiusMeters);

  // 3. Normaliser, mapper les catégories et sauvegarder en base (Upsert)
  if (rawElements && rawElements.length > 0) {
    await saveActivitiesBatch(rawElements);
  }

  // 4. Filtrer précisément avec PostGIS (ST_DWithin) et récupérer les distances
  const client = await pool.connect();
  let activities;
  try {
    activities = await findNearbyActivities(client, longitude, latitude, radiusMeters);
  } finally {
    client.release();
  }

  // 5. Enregistrer la recherche dans la table 'searches'
  const searchRecord = await createSearchRecord({
    visitorId,
    address,
    latitude,
    longitude,
    radius: radiusMeters
  });

  // 6. Retourner l'ID unique de recherche et les activités candidates
  return {
    searchId: searchRecord.id,
    searchCenter: { latitude, longitude },
    radiusMeters,
    count: activities.length,
    activities
  };
}