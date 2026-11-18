
import fs from "node:fs";
import { saveActivitiesBatch } from "../src/services/activityService.js";
import pool from "../src/db.js";

async function main() {
  const activities = JSON.parse(
    fs.readFileSync("data/activities-idf.json", "utf8")
  );

  const batchSize = 200;
  let imported = 0;

  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize);

    await saveActivitiesBatch(batch);

    imported += batch.length;
    console.log(`${imported}/${activities.length} activités traitées`);
  }

  console.log("Importation terminée.");
}

try {
  await main();
} catch (error) {
  console.error("Erreur d'importation :", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
