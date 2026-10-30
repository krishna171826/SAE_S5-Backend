export async function fetchActivities(latitude, longitude, radius) {

    
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

  

  const response = await fetch(
    "https://overpass.private.coffee/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "SAE-S5-Activities/1.0"
      },
      body: "data=" + encodeURIComponent(query)
    }
  );

  if (!response.ok) {
    console.log("Erreur HTTP :", response.status);
    console.log(await response.text());
    return [];
  }

  const data = await response.json();

  return data.elements || [];
}