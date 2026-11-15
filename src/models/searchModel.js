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


export async function saveRecommendations(searchId, recommendations) {
  if (recommendations.length === 0) return;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Récupérer l'identifiant de l'algorithme scoring
    const result = await client.query(
      "SELECT id FROM algorithms WHERE name = $1",
      ["scoring"]
    );

    if (result.rows.length === 0) {
      throw new Error("Algorithme scoring introuvable");
    }

    const algorithmId = result.rows[0].id;

    // Enregistrer chaque recommandation
    for (const activity of recommendations) {
      await client.query(
        `INSERT INTO recommendations
         (search_id, activity_id, algorithm_id, score, rank_position)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          searchId,
          activity.id,
          algorithmId,
          activity.score,
          activity.rank
        ]
      );
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
