/**
 * Service de mapping des catégories (Issue #15).
 */
export const CATEGORY_RULES = [
  // --- CULTURE ---
  { key: 'tourism', value: 'museum', category: 'Culture' },
  { key: 'tourism', value: 'gallery', category: 'Culture' },
  { key: 'historic', value: '*', category: 'Culture' },
  { key: 'amenity', value: 'cinema', category: 'Culture' },
  { key: 'amenity', value: 'theatre', category: 'Culture' },
  { key: 'amenity', value: 'arts_centre', category: 'Culture' },
  { key: 'amenity', value: 'music_venue', category: 'Culture' },
  { key: 'amenity', value: 'community_centre', category: 'Culture' },

  // --- NATURE ---
  { key: 'leisure', value: 'park', category: 'Nature' },
  { key: 'leisure', value: 'garden', category: 'Nature' },
  { key: 'leisure', value: 'nature_reserve', category: 'Nature' },
  { key: 'natural', value: '*', category: 'Nature' },
  

  // --- LOISIRS & FAMILLE ---
  { key: 'leisure', value: 'playground', category: 'Loisirs' },
  { key: 'tourism', value: 'attraction', category: 'Loisirs' },
  { key: 'tourism', value: 'viewpoint', category: 'Loisirs' },
  { key: 'amenity', value: 'community_centre', category: 'Culture' },
  { key: 'tourism', value: 'viewpoint', category: 'Loisirs' },

  // --- SPORT ---
  { key: 'leisure', value: 'pitch', category: 'Sport' },
  { key: 'leisure', value: 'sports_centre', category: 'Sport' },
  { key: 'sport', value: '*', category: 'Sport' },

  // --- RESTAURATION ---
  { key: 'amenity', value: 'restaurant', category: 'Restauration' },
  { key: 'amenity', value: 'cafe', category: 'Restauration' },
  { key: 'amenity', value: 'fast_food', category: 'Restauration' }
];

export function mapActivityCategories(osmTags) {
  if (!osmTags || typeof osmTags !== 'object') {
    return [];
  }

  const matchedCategories = new Set();

  for (const rule of CATEGORY_RULES) {
    const tagValue = osmTags[rule.key];
    if (tagValue !== undefined) {
      if (rule.value === '*' || rule.value === tagValue) {
        matchedCategories.add(rule.category);
      }
    }
  }

  return Array.from(matchedCategories);
}