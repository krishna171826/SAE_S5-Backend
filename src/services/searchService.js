import { geocodeAddress } from "./geoCodingService.js";
import { fetchActivities } from './overpassService.js';
import { saveActivitiesBatch } from "./activityService.js";
import { findNearbyActivities } from "../models/activityModel.js";
import { createSearchRecord, saveRecommendations } from "../models/searchModel.js";
import pool from "../db.js";

export async function processSearch({ address, radius, visitorId, preferences }) {
  const { latitude, longitude } = await geocodeAddress(address);
  const radiusMeters = Number(radius);

  const rawElements = await fetchActivities(latitude, longitude, radiusMeters);

  if (rawElements && rawElements.length > 0) {
    await saveActivitiesBatch(rawElements);
  }

  const client = await pool.connect();
  let activities;
  try {
    activities = await findNearbyActivities(client, longitude, latitude, radiusMeters, preferences);
  } finally {
    client.release();
  }

  
  // Préparer les données pour Python
  const payloadForPython = {
    preferences: {
      ...preferences,
      searchCenter: { latitude, longitude },
      radiusMeters
    },
    activities: activities.map(act => ({
      id: act.id,
      name: act.name,
      distance: Number(act.distance),
      fee: act.fee,
      indoor_outdoor: act.indoor_outdoor,
      categories: act.categories
    }))
  };

  // Appeler FastAPI
  let response;

  try {
    response = await fetch(
      `${process.env.FASTAPI_URL}/recommend/scoring`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadForPython),
        signal: AbortSignal.timeout(10000)
      }
    );
  } catch (error) {
    const err = new Error("Le moteur Python ne répond pas.");
    err.statusCode = 502;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Erreur FastAPI : ${response.status}`);
    err.statusCode = 502;
    throw err;
  }

  // Récupérer les résultats
  const data = await response.json();
  const rankedActivities = data.recommendations;

  if (!Array.isArray(rankedActivities)) {
    throw new Error("Réponse invalide de FastAPI");
  }

  const searchRecord = await createSearchRecord({
    visitorId,
    address,
    latitude,
    longitude,
    radius: radiusMeters
  });

  // 8. Enregistrer les recommandations en base
  await saveRecommendations(searchRecord.id, rankedActivities);

  // 9. Ajouter les informations complètes des activités
  const activitiesById = new Map(
    activities.map(act => [String(act.id), act])
  );

  const recommendations = rankedActivities.map(act => ({
    ...activitiesById.get(String(act.id)),
    score: act.score,
    rank: act.rank
  }));

  // 10. Retourner les résultats à Express
  return {
    searchId: searchRecord.id,
    searchCenter: { latitude, longitude },
    radiusMeters,
    count: recommendations.length,
    recommendations
  };
}