import pool from '../db.js';
import { upsertActivity, linkActivityCategories, findNearbyActivitiesModel } from '../models/activityModel.js';
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
/**
 * Récupère, filtre et formate les activités situées dans un rayon défini autour d'un point GPS.
 *
 * @param {number|string} lon - La longitude du point central de recherche.
 * @param {number|string} lat - La latitude du point central de recherche.
 * @param {number|string} [radius=5000] - Le rayon de recherche en mètres (par défaut : 5000, max : 50000).
 * @returns {Promise<Array<Object>>} Retourne une promesse résolue avec le tableau des activités (tableActivitesFinal).
 * @throws {Error} Lève une erreur si les coordonnées GPS fournies sont invalides ou si le rayon est hors limites.
 */
export async function getActivitiesNearLocation(lon, lat, radius) {
  const longitude = parseFloat(lon);
  const latitude = parseFloat(lat);
  const rayon = parseInt(radius, 10) || 5000;

  // Validation des paramètres
  if (isNaN(longitude) || isNaN(latitude)) {
    throw new Error("Les coordonnées GPS fournies sont invalides.");
  }
  if (rayon <= 0 || rayon > 50000) {
    throw new Error("Le rayon de recherche doit être compris entre 1 et 50 000 mètres.");
  }

  const client = await pool.connect();

  try {
    // Exécution de la requête spatiale (Appel au Model)
    const activites = await findNearbyActivities(client, longitude, latitude, rayon);

    // 1. Initialisation du tableau final
    const tableActivitesFinal = [];

    // 2. Boucle de formatage des données brutes
    for (const activite of activites) {
      tableActivitesFinal.push({
        id: activite.id,
        nom: activite.name,
        adresse: activite.address,
        type: activite.osm_type,
        distance: activite.distance,
        coordonnees: {
          lat: activite.latitude,
          lon: activite.longitude
        },
        details: activite.osm_tags
      });
    }

    // 3. Retourne le tableau formaté prêt à être envoyé au client
    return tableActivitesFinal;

  } finally {
    // Libération de la connexion à la base de données
    client.release();
  }
}
