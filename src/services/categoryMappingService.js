/**
 * Service de mapping des catégories (Issue #15).
 */
export const CATEGORY_RULES = [
  { key: 'tourism', value: 'museum', category: 'Culture' },
  { key: 'tourism', value: 'gallery', category: 'Culture' },
  { key: 'historic', value: '*', category: 'Culture' },
  { key: 'leisure', value: 'park', category: 'Nature' },
  { key: 'leisure', value: 'garden', category: 'Nature' },
  { key: 'leisure', value: 'nature_reserve', category: 'Nature' },
  { key: 'sport', value: '*', category: 'Sport' },
  { key: 'amenity', value: 'restaurant', category: 'Restauration' },
  { key: 'amenity', value: 'cafe', category: 'Restauration' }
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