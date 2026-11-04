/**
 * Service de normalisation des données OpenStreetMap (Issue #14).
 */
export function normalizeActivity(element) {
  if (!element || !element.id || !element.type) {
    return null;
  }

  let latitude = element.lat;
  let longitude = element.lon;

  if ((latitude === undefined || longitude === undefined) && element.center) {
    latitude = element.center.lat;
    longitude = element.center.lon;
  }

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  const tags = element.tags || {};
  const name = tags.name || tags['name:fr'] || tags['name:en'] || tags.title || 'Lieu sans nom';

  // --- ADRESSE ---
  const houseNumber = tags['addr:housenumber'] || '';
  const street = tags['addr:street'] || '';
  const postcode = tags['addr:postcode'] || '';
  const city = tags['addr:city'] || '';
  const addressParts = [houseNumber, street, postcode, city].filter(Boolean);
  const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

  // --- INDOOR / OUTDOOR AVEC DÉDUCTION INTELLIGENTE ---
  let indoor = null;
  if (tags.indoor === 'yes') {
    indoor = true;
  } else if (tags.indoor === 'no') {
    indoor = false;
  } else {
    const isCulturalOrIndoor = 
      tags.tourism === 'museum' || 
      tags.tourism === 'gallery' || 
      tags.amenity === 'cinema' || 
      tags.amenity === 'theatre' || 
      tags.amenity === 'arts_centre';

    const isOutdoor = 
      tags.leisure === 'park' || 
      tags.leisure === 'garden' || 
      tags.leisure === 'pitch' || 
      tags.natural === 'wood';

    if (isCulturalOrIndoor) indoor = true;
    else if (isOutdoor) indoor = false;
  }

  // --- GRATUITÉ ---
  const free = tags.fee === 'no' || tags.charge === 'no' ? true : (tags.fee === 'yes' || tags.charge === 'yes' ? false : null);

  return {
    osm_id: element.id,
    osm_type: element.type,
    name: name.trim(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    address: formattedAddress,
    website: tags.website || tags['contact:website'] || null,
    phone: tags.phone || tags['contact:phone'] || null,
    free: free,
    indoor: indoor,
    osm_tags: tags
  };
}

/**
 * Normalise un tableau d'éléments OpenStreetMap.
 */
export function normalizeActivities(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map(normalizeActivity).filter(item => item !== null);
}