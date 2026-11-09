
/**
 * Service de normalisation des données OpenStreetMap.
 * Issue #14
 */

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function firstText(...values) {
  return values.find(
    value => typeof value === 'string' && value.trim()
  )?.trim() || null;
}

function tagValues(value) {
  if (typeof value !== 'string') return [];

  return value
    .split(';')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);
}

// --------------------------------------------------
// NOMS
// --------------------------------------------------

const TYPE_LABELS = {
  amenity: {
    restaurant: 'Restaurant',
    cafe: 'Café',
    fast_food: 'Restauration rapide',
    bar: 'Bar',
    pub: 'Pub',
    library: 'Bibliothèque',
    theatre: 'Théâtre',
    cinema: 'Cinéma',
    arts_centre: 'Centre culturel',
    community_centre: 'Maison de quartier',
    nightclub: 'Discothèque',
    swimming_pool: 'Piscine'
  },

  tourism: {
    museum: 'Musée',
    gallery: 'Galerie',
    viewpoint: 'Point de vue',
    attraction: 'Attraction',
    zoo: 'Zoo',
    aquarium: 'Aquarium',
    theme_park: 'Parc d’attractions'
  },

  leisure: {
    garden: 'Jardin',
    park: 'Parc',
    playground: 'Aire de jeux',
    pitch: 'Terrain de sport',
    sports_centre: 'Centre sportif',
    sports_hall: 'Salle de sport',
    fitness_centre: 'Salle de fitness',
    swimming_pool: 'Piscine',
    stadium: 'Stade',
    track: 'Piste sportive',
    nature_reserve: 'Réserve naturelle',
    bowling_alley: 'Bowling',
    escape_game: 'Escape game',
    golf_course: 'Golf'
  },

  natural: {
    wood: 'Bois',
    beach: 'Plage',
    waterfall: 'Cascade'
  },

  historic: {
    monument: 'Monument',
    memorial: 'Mémorial',
    castle: 'Château'
  },

  shop: {
    bakery: 'Boulangerie',
    pastry: 'Pâtisserie'
  }
};

function inferLabel(tags) {
  const keys = [
    'amenity',
    'tourism',
    'leisure',
    'natural',
    'historic',
    'shop'
  ];

  for (const key of keys) {
    const value = tagValues(tags[key])[0];

    if (value && TYPE_LABELS[key]?.[value]) {
      return TYPE_LABELS[key][value];
    }
  }

  if (
    tagValues(tags.sport).some(
      value => !['no', 'none'].includes(value)
    )
  ) {
    return 'Équipement sportif';
  }

  return 'Lieu sans nom';
}

function getName(tags) {
  const name = firstText(
    tags.name,
    tags['name:fr'],
    tags['name:en'],
    tags.official_name,
    tags['official_name:fr'],
    tags.loc_name,
    tags.short_name,
    tags.alt_name,
    tags.brand,
    tags['brand:fr'],
    tags['operator:name'],
    tags.title
  );

  return {
    name: name || inferLabel(tags),
    name_source: name ? 'osm' : 'generated'
  };
}

// --------------------------------------------------
// ADRESSE
// --------------------------------------------------

function getAddress(tags) {
  const fullAddress = firstText(tags['addr:full']);

  if (fullAddress) return fullAddress;

  const houseNumber = firstText(
    tags['addr:housenumber']
  );

  const street = firstText(
    tags['addr:street'],
    tags['addr:place']
  );

  const postcode = firstText(
    tags['addr:postcode']
  );

  const city = firstText(
    tags['addr:city']
  );

  const country = firstText(
    tags['addr:country']
  );

  const streetLine = [
    houseNumber,
    street
  ].filter(Boolean).join(' ');

  const cityLine = [
    postcode,
    city
  ].filter(Boolean).join(' ');

  return [
    streetLine,
    cityLine,
    country
  ].filter(Boolean).join(', ') || null;
}

// --------------------------------------------------
// INDOOR / OUTDOOR
// --------------------------------------------------

function getIndoor(tags) {
  const indoorValues = tagValues(tags.indoor);
  const locationValues = tagValues(tags.location);

  if (
    indoorValues.some(value =>
      ['yes', 'room', 'area', 'corridor'].includes(value)
    )
  ) {
    return true;
  }

  if (
    indoorValues.includes('no') ||
    locationValues.includes('outdoor')
  ) {
    return false;
  }

  const isIndoor =
    ['museum', 'gallery'].includes(tags.tourism) ||
    [
      'cinema',
      'theatre',
      'library',
      'arts_centre',
      'restaurant',
      'cafe'
    ].includes(tags.amenity) ||
    [
      'sports_hall',
      'fitness_centre',
      'bowling_alley'
    ].includes(tags.leisure);

  const isOutdoor =
    [
      'park',
      'garden',
      'playground',
      'golf_course',
      'track',
      'pitch'
    ].includes(tags.leisure) ||
    [
      'wood',
      'beach',
      'heath',
      'waterfall'
    ].includes(tags.natural) ||
    tags.tourism === 'viewpoint' ||
    tags.landuse === 'forest';

  if (isIndoor) return true;
  if (isOutdoor) return false;

  return null;
}

// --------------------------------------------------
// GRATUITÉ
// --------------------------------------------------

function getFree(tags) {
  const fee = firstText(tags.fee)?.toLowerCase();
  const charge = firstText(tags.charge)?.toLowerCase();

  if (fee === 'no' || fee === '0') {
    return true;
  }

  if (fee === 'yes') {
    return false;
  }

  if (charge) {
    if (['0', '0 eur', '0€'].includes(charge)) {
      return true;
    }

    return false;
  }

  return null;
}

// --------------------------------------------------
// COORDONNÉES
// --------------------------------------------------

function getCoordinates(element) {
  const rawLatitude =
    element.lat ??
    element.center?.lat ??
    element.latitude;

  const rawLongitude =
    element.lon ??
    element.center?.lon ??
    element.longitude;

  if (rawLatitude == null || rawLongitude == null) {
    return null;
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    latitude,
    longitude
  };
}

// --------------------------------------------------
// NORMALISATION PRINCIPALE
// --------------------------------------------------

export function normalizeActivity(element) {
  if (
    !element ||
    !['node', 'way', 'relation'].includes(element.type) ||
    element.id == null
  ) {
    return null;
  }

  const coordinates = getCoordinates(element);

  if (!coordinates) return null;

  const tags =
    element.tags &&
    typeof element.tags === 'object' &&
    !Array.isArray(element.tags)
      ? element.tags
      : {};

  const { name, name_source } = getName(tags);

  const address = getAddress(tags);

  return {
    osm_id: element.id,
    osm_type: element.type,

    name,
    name_source,

    latitude: coordinates.latitude,
    longitude: coordinates.longitude,

    address,
    address_source: address ? 'osm' : 'missing',

    website: firstText(
      tags.website,
      tags['contact:website'],
      tags.url
    ),

    phone: firstText(
      tags.phone,
      tags['contact:phone'],
      tags['phone:mobile']
    ),

    free: getFree(tags),
    indoor: getIndoor(tags),

    osm_tags: tags
  };
}

// --------------------------------------------------
// NORMALISATION D'UN TABLEAU
// --------------------------------------------------

export function normalizeActivities(elements) {
  if (!Array.isArray(elements)) return [];

  return elements
    .map(normalizeActivity)
    .filter(item => item !== null);
}
