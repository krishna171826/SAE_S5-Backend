
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
      'music_venue',
      'planetarium',
      'theatre'
    ],
    tourism: [
      'gallery',
      'museum'
    ]
  },

  Nature: {
    leisure: [
      'garden',
      'nature_reserve',
      'park'
    ],
    tourism: [
      'nature_reserve'
    ],
    natural: [
      'beach',
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
      'water_park',
      'trampoline_park'
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
      'golf_course',
      'ice_rink',
      'pitch',
      'sports_centre',
      'sports_hall',
      'swimming_pool',
      'disc_golf_course',
      'swimming_area'
    ],
    sport: [
      'climbing',
      'karting',
      'laser_tag',
      'paintball',
      'tennis',
      'basketball',
      'soccer',
      'badminton',
      'table_tennis',
      'swimming',
      'padel'
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
    ]
  }
};

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

// Catégorie PRINCIPALE

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
