import { geocodeAddress } from "./geoCodingService.js";
import { fetchActivities } from './overpassService.js';
import { saveActivitiesBatch } from "./activityService.js";
import { findNearbyActivities } from "../models/activityModel.js";
import { createSearchRecord } from "../models/searchModel.js";
import pool from "../db.js";

export async function processSearch({ address, radius, visitorId, preferences }) {
  const { latitude, longitude } = await geocodeAddress(address);
  const radiusMeters = parseFloat(radius) || 5000;

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

  const searchRecord = await createSearchRecord({
    visitorId,
    address,
    latitude,
    longitude,
    radius: radiusMeters
  });

  return {
    searchId: searchRecord.id,
    payloadForPython: {
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
    }
  };
}