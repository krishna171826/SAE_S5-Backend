
/**
 * Service de catégorisation des activités OpenStreetMap.
 *
 * Une activité peut appartenir à plusieurs catégories.
 */

export const CATEGORY_VALUES = {
  Culture: {
    amenity: [
      'arts_centre',
      'cinema',
      'community_centre',
      'library',
      'music_venue',
      'planetarium',
      'theatre',
      'conference_centre'
    ],
    tourism: [
      'gallery',
      'museum'
    ],
    leisure: [
      'cultural_centre'
    ],
    historic: [
      'castle',
      'fort',
      'monument',
      'memorial',
      'archaeological_site',
      'ruins'
    ]
  },

  Nature: {
    leisure: [
      'garden',
      'nature_reserve',
      'park',
      'bird_hide'
    ],
    tourism: [
      'nature_reserve'
    ],
    natural: [
      'beach',
      'heath',
      'wood',
      'waterfall',
      'cave_entrance'
    ],
    landuse: [
      'forest',
      'recreation_ground'
    ]
  },

  Loisirs: {
    amenity: [
      'nightclub',
      'casino'
    ],
    leisure: [
      'amusement_arcade',
      'beach_resort',
      'bowling_alley',
      'dance',
      'escape_game',
      'horse_riding',
      'miniature_golf',
      'playground',
      'water_park',
      'adult_gaming_centre'
    ],
    tourism: [
      'aquarium',
      'attraction',
      'theme_park',
      'viewpoint',
      'zoo'
    ]
  },

  Sport: {
    leisure: [
      'fitness_centre',
      'golf_course',
      'ice_rink',
      'pitch',
      'sports_centre',
      'sports_hall',
      'stadium',
      'swimming_pool',
      'track',
      'fitness_station'
    ],
    sport: '*',
    club: [
      'sport'
    ]
  },

  Restauration: {
    amenity: [
      'bar',
      'biergarten',
      'cafe',
      'fast_food',
      'food_court',
      'ice_cream',
      'pub',
      'restaurant'
    ],
    shop: [
      'bakery',
      'pastry',
      'confectionery',
      'deli'
    ]
  }
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function tagValues(value) {
  if (typeof value !== 'string') return [];

  return value
    .split(';')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);
}

function matchesTag(osmTags, key, allowedValues) {
  const values = tagValues(osmTags[key]);

  if (values.length === 0) return false;

  if (allowedValues === '*') {
    return values.some(
      value => !['no', 'none'].includes(value)
    );
  }

  return values.some(value =>
    allowedValues.includes(value)
  );
}

// --------------------------------------------------
// CATÉGORISATION PRINCIPALE
// --------------------------------------------------

export function mapActivityCategories(osmTags) {
  if (
    !osmTags ||
    typeof osmTags !== 'object' ||
    Array.isArray(osmTags)
  ) {
    return [];
  }

  const categories = [];

  for (
    const [category, rules]
    of Object.entries(CATEGORY_VALUES)
  ) {
    const matches = Object.entries(rules).some(
      ([key, allowedValues]) =>
        matchesTag(
          osmTags,
          key,
          allowedValues
        )
    );

    if (matches) {
      categories.push(category);
    }
  }

  return categories;
}
