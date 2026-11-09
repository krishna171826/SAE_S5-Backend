// src/models/searchModel.js
import pool from '../db.js';

/**
 * Enregistre une recherche utilisateur dans la table searches
 */
export async function createSearchRecord({ visitorId, address, latitude, longitude, radius }) {
  const query = `
    INSERT INTO searches (user_id, address, latitude, longitude, radius_m)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, created_at;
  `;
  const values = [visitorId || null, address, latitude, longitude, radius];
  const result = await pool.query(query, values);
  return result.rows[0];
}