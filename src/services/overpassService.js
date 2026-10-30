export async function fetchActivities(latitude, longitude, radius) {
  const query = `
    [out:json][timeout:25];
    (
      node["leisure"](around:${radius},${latitude},${longitude});
      way["leisure"](around:${radius},${latitude},${longitude});
    );
    out center;
  `;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
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