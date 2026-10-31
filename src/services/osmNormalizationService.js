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

  return {
    osm_id: element.id,
    osm_type: element.type,
    name: name.trim(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    website: tags.website || tags['contact:website'] || null,
    phone: tags.phone || tags['contact:phone'] || null,
    free: tags.fee === 'no' || tags.charge === 'no' ? true : (tags.fee === 'yes' || tags.charge === 'yes' ? false : null),
    indoor: tags.indoor === 'yes' ? true : (tags.indoor === 'no' ? false : null),
    osm_tags: tags
  };
}

export function normalizeActivities(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map(normalizeActivity).filter(item => item !== null);
}