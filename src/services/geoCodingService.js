
export async function geocodeAddress(address) {

  // Vérifier que l'adresse est renseignée
  if (typeof address !== "string" || !address.trim()) {
    return {
      success: false,
      message: "Veuillez saisir une adresse."
    };
  }

  // Construire l'URL avec l'adresse
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address.trim())}&format=jsonv2&limit=1`;

  // Envoyer la requête à Nominatim
  const response = await fetch(url, {
    headers: {
      "User-Agent": "SAE_S5/1.0 (https://github.com/krishna171826/SAE_S5)"
    },
    signal: AbortSignal.timeout(10000)
  });

  // Vérifier si le serveur a répondu correctement
  if (!response.ok) {
    throw new Error(`Erreur Nominatim : ${response.status}`);
  }

  // Récupérer les résultats JSON
  const results = await response.json();

  // Si aucune adresse n'a été trouvée
  if (results.length === 0) {
    return {
      success: false,
      message: "Adresse introuvable. Veuillez vérifier votre saisie."
    };
  }

  // Retourner les coordonnées GPS
  return {
    success: true,
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon)
  };
}
