
import { CATEGORY_VALUES } from "./categoryMappingService.js";

export async function fetchActivities(latitude, longitude, radius, categories = []) {

  // 1. Déterminer les catégories à rechercher
  // Si aucune catégorie n'est choisie, rechercher toutes les catégories
  const selectedCategories =
    Array.isArray(categories) && categories.length > 0
      ? categories.filter(category =>
          Object.hasOwn(CATEGORY_VALUES, category)
        )
      : Object.keys(CATEGORY_VALUES);

  const categoriesToSearch = selectedCategories.length > 0
    ? selectedCategories
    : Object.keys(CATEGORY_VALUES);

  // 2. Regrouper les tags OSM par type
  const tagsByKey = new Map();

  for (const category of categoriesToSearch) {
    const rules = CATEGORY_VALUES[category];

    for (const [key, values] of Object.entries(rules)) {
      if (!tagsByKey.has(key)) {
        tagsByKey.set(key, new Set());
      }

      for (const value of values) {
        tagsByKey.get(key).add(value);
      }
    }
  }

  // 3. Construire uniquement les requêtes nécessaires
  const clauses = [];

  for (const [key, values] of tagsByKey) {
    const regex = [...values].join("|");

    clauses.push(
      `nwr["${key}"~"^(${regex})$"](around:${radius},${latitude},${longitude});`
    );
  }

  const query = `
    [out:json][timeout:25];
    (
      ${clauses.join("\n")}
    );
    out center;
  `;

  console.log("Catégories recherchées :", categoriesToSearch);

  // 4. Serveurs Overpass disponibles
  const servers = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter"
  ];

  // 5. Interroger les serveurs dans l'ordre
  for (const server of servers) {
    try {
      console.log(`Tentative Overpass : ${server}`);

      const response = await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "SAE-S5-Activities/1.0"
        },
        body: "data=" + encodeURIComponent(query),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.elements)) {
        throw new Error("Réponse Overpass invalide");
      }

      console.log(`Overpass : ${data.elements.length} lieux récupérés`);

      return data.elements;

    } catch (error) {
      console.error(
        `Échec Overpass (${server}) :`,
        error.message
      );
    }
  }

  // 6. Aucun serveur disponible
  console.error("Tous les serveurs Overpass ont échoué.");
  return [];
}
