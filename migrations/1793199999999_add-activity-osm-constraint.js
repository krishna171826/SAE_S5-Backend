exports.up = (pgm) => {
  pgm.addConstraint('activities', 'activities_osm_type_osm_id_key', {
    unique: ['osm_type', 'osm_id']
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('activities', 'activities_osm_type_osm_id_key');
};