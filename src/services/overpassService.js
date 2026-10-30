export async function fetchActivities(latitude, longitude, radius) {

    const query = `
  [out:json][timeout:25];
  (
    nwr["leisure"~"^(bowling_alley|escape_game|sports_centre|fitness_centre|swimming_pool|trampoline_park|amusement_arcade|park|ice_rink|water_park)$"](around:${radius},${latitude},${longitude});

    nwr["amenity"~"^(cinema|theatre|arts_centre)$"](around:${radius},${latitude},${longitude});

    nwr["tourism"~"^(museum|gallery|attraction)$"](around:${radius},${latitude},${longitude});

    nwr["sport"~"^(climbing|karting|laser_tag|tennis)$"](around:${radius},${latitude},${longitude});
  );
  out center;

`;
  

  const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
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