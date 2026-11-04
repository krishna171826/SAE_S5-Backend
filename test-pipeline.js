import { fetchActivities } from './src/services/overpassService.js';
import { saveActivitiesBatch } from './src/services/activityService.js';

async function testPipeline() {
  console.log("🚀 Lancement du test du pipeline complet (ES Modules)...");

  const lat = 48.8566;
  const lon = 2.3522;
  const radius = 1000;

  try {
    console.log("1️⃣ Appel de l'API Overpass (#13)...");
    const rawElements = await fetchActivities(lat, lon, radius);
    console.log(`✅ ${rawElements.length} éléments bruts récupérés depuis OpenStreetMap.`);

    if (rawElements.length === 0) {
      console.log("⚠️ Aucun élément trouvé.");
      return;
    }

    console.log("2️⃣ 3️⃣ 4️⃣ Normalisation (#14), Mapping (#15) et Upsert en base (#16)...");
    const result = await saveActivitiesBatch(rawElements);

    console.log("🎉 Test réussi avec succès !");
    console.log(result);

  } catch (error) {
    console.error("❌ Échec du test du pipeline :", error);
  } finally {
    process.exit(0);
  }
}

testPipeline();