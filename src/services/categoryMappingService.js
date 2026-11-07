
export const CATEGORY_RULES = [
  // CULTURE
  { key: 'tourism', value: 'museum', category: 'Culture' },
  { key: 'tourism', value: 'gallery', category: 'Culture' },
  { key: 'amenity', value: 'cinema', category: 'Culture' },
  { key: 'amenity', value: 'theatre', category: 'Culture' },
  { key: 'amenity', value: 'arts_centre', category: 'Culture' },
  { key: 'amenity', value: 'music_venue', category: 'Culture' },
  { key: 'amenity', value: 'planetarium', category: 'Culture' },
  { key: 'amenity', value: 'community_centre', category: 'Culture' },

  // NATURE
  { key: 'leisure', value: 'park', category: 'Nature' },
  { key: 'leisure', value: 'garden', category: 'Nature' },
  { key: 'leisure', value: 'nature_reserve', category: 'Nature' },

  // LOISIRS
  { key: 'leisure', value: 'bowling_alley', category: 'Loisirs' },
  { key: 'leisure', value: 'escape_game', category: 'Loisirs' },
  { key: 'leisure', value: 'amusement_arcade', category: 'Loisirs' },
  { key: 'leisure', value: 'playground', category: 'Loisirs' },
  { key: 'leisure', value: 'water_park', category: 'Loisirs' },
  { key: 'tourism', value: 'attraction', category: 'Loisirs' },
  { key: 'tourism', value: 'theme_park', category: 'Loisirs' },
  { key: 'tourism', value: 'zoo', category: 'Loisirs' },
  { key: 'tourism', value: 'aquarium', category: 'Loisirs' },
  { key: 'tourism', value: 'viewpoint', category: 'Loisirs' },
  { key: 'amenity', value: 'nightclub', category: 'Loisirs' },

  // SPORT
  { key: 'leisure', value: 'pitch', category: 'Sport' },
  { key: 'leisure', value: 'sports_centre', category: 'Sport' },
  { key: 'leisure', value: 'fitness_centre', category: 'Sport' },
  { key: 'leisure', value: 'swimming_pool', category: 'Sport' },
  { key: 'leisure', value: 'ice_rink', category: 'Sport' },
  { key: 'sport', value: '*', category: 'Sport' },

  // RESTAURATION
  { key: 'amenity', value: 'restaurant', category: 'Restauration' },
  { key: 'amenity', value: 'cafe', category: 'Restauration' },
  { key: 'amenity', value: 'fast_food', category: 'Restauration' }
];

export function mapActivityCategories(osmTags) {
  if (!osmTags || typeof osmTags !== 'object') {
    return [];
  }

  const categories = new Set();

  for (const rule of CATEGORY_RULES) {
    const value = osmTags[rule.key];

    if (value === rule.value || (rule.value === '*' && value !== undefined)) {
      categories.add(rule.category);
    }
  }

  return Array.from(categories);
}
