import pool from '../db.js';
import { upsertActivity, linkActivityCategories } from '../models/activityModel.js';
import { normalizeActivities } from './osmNormalizationService.js';
import { mapActivityCategories } from './categoryMappingService.js';

export async function saveActivitiesBatch(rawElements) {
  const normalizedList = normalizeActivities(rawElements);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    let savedCount = 0;

    for (const activity of normalizedList) {
      const categories = mapActivityCategories(activity.osm_tags);
      const activityId = await upsertActivity(client, activity);
      await linkActivityCategories(client, activityId, categories);
      savedCount++;
    }

    await client.query('COMMIT');
    return { success: true, processed: savedCount };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erreur transaction import :", error.message);
    throw error;
  } finally {
    client.release();
  }
}