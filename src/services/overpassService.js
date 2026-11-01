
export async function fetchActivities(latitude, longitude, radius) {

  // Construire la requête avec les tags OSM
  const query = `
    [out:json][timeout:25];
    (
      nwr["leisure"](around:${radius},${latitude},${longitude});

      nwr["amenity"~"^(cinema|theatre|arts_centre|music_venue|nightclub|planetarium|community_centre)$"](around:${radius},${latitude},${longitude});

      nwr["tourism"~"^(museum|gallery|attraction|theme_park|zoo|aquarium|viewpoint)$"](around:${radius},${latitude},${longitude});

      nwr["sport"~"^(climbing|karting|laser_tag|paintball|tennis|basketball|soccer|badminton|table_tennis|swimming)$"](around:${radius},${latitude},${longitude});
    );
    out center;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "SAE-S5-Activities/1.0"
        },
        body: "data=" + encodeURIComponent(query),
        signal: AbortSignal.timeout(600000)
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data.elements || [];

  } catch (error) {
    console.error("Erreur Overpass :", error);
    return [];
  }
}
