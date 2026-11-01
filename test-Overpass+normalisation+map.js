/**
 * Test des Issues #13, #14 et #15 (Overpass + Normalisation + Mapping)
 */
import { fetchActivities } from './src/services/overpassService.js';
import { normalizeActivities } from './src/services/osmNormalizationService.js';
import { mapActivityCategories } from './src/services/categoryMappingService.js';

async function test1314And15() {
  console.log("==================================================");
  console.log("🧪 TEST DES ISSUES 13, 14 & 15 (Pipeline complet sans DB)");
  console.log("==================================================");

  const lat = 48.8566;
  const lon = 2.3522;
  const radius = 5000;

  try {
    console.log("1️⃣ Récupération des données brutes Overpass (#13)...");
    const rawElements = await fetchActivities(lat, lon, radius);
    console.log(`✅ ${rawElements.length} éléments bruts récupérés.`);

    if (rawElements.length === 0) {
      console.log("⚠️ Aucun élément trouvé.");
      return;
    }

    console.log("2️⃣ Normalisation des éléments (#14)...");
    const cleanActivities = normalizeActivities(rawElements);

    console.log("3️⃣ Application du mapping des catégories (#15)...");
    const mappedActivities = cleanActivities.map(act => {
      const categories = mapActivityCategories(act.osm_tags);
      return {
        ...act,
        categories
      };
    });

    console.log(`✨ ${mappedActivities.length} éléments traités avec succès.`);

    // Afficher un aperçu des 5 premiers éléments avec leurs catégories traduits
    mappedActivities.slice(0, 20).forEach((act, index) => {
      console.log(`\n   --- Activité #${index + 1} ---`);
      console.log(`   Nom           : ${act.name}`);
      console.log(`   Tags bruts    :`, act.osm_tags);
      console.log(`   Catégories 🏷️ :`, act.categories.length > 0 ? act.categories : '❌ Aucune (ignoré par le mapping)');
    });

  } catch (error) {
    console.error("❌ Erreur pendant le test :", error);
  } finally {
    process.exit(0);
  }
}

test1314And15();