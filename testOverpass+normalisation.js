/**
 * Test de l'Issue #13 (Overpass) et l'Issue #14 (Normalisation)
 */
import { fetchActivities } from './src/services/overpassService.js';
import { normalizeActivities } from './src/services/osmNormalizationService.js';

async function test13And14() {
  console.log("==================================================");
  console.log("🧪 TEST DES ISSUES 13 & 14 (Overpass + Normalisation)");
  console.log("==================================================");

  // Coordonnées de test (ex: Paris centre) avec un rayon de 1000m (1km)
  const lat = 48.8566;
  const lon = 2.3522;
  const radius = 1000;

  try {
    console.log("1️⃣ Récupération des données brutes depuis Overpass (#13)...");
    const rawElements = await fetchActivities(lat, lon, radius);
    console.log(`✅ ${rawElements.length} éléments bruts récupérés.`);

    if (rawElements.length === 0) {
      console.log("⚠️ Aucun élément trouvé. Essaie de changer de coordonnées.");
      return;
    }

    console.log("\n2️⃣ Nettoyage et normalisation des éléments (#14)...");
    const cleanActivities = normalizeActivities(rawElements);
    console.log(`✨ Résultat : ${cleanActivities.length} éléments valides après normalisation.`);

    // Afficher un aperçu des 3 premiers éléments normalisés
    cleanActivities.slice(0, 3).forEach((act, index) => {
      console.log(`\n   --- Activité #${index + 1} ---`);
      console.log(`   Nom propre : ${act.name}`);
      console.log(`   Type / ID  : ${act.osm_type} (${act.osm_id})`);
      console.log(`   Coordonnées: [${act.latitude}, ${act.longitude}]`);
      console.log(`   Attributs  : Gratuit (${act.free}), Intérieur (${act.indoor}), Site (${act.website || 'aucun'})`);
      console.log(`   Tags JSON  :`, act.osm_tags);
    });

  } catch (error) {
    console.error("❌ Erreur pendant le test :", error);
  } finally {
    process.exit(0);
  }
}

test13And14();