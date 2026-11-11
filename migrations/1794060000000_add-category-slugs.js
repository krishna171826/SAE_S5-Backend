exports.up = (pgm) => {
  pgm.addColumn('categories', {
    slug: { type: 'varchar(255)' }
  });

  pgm.sql(`
    UPDATE categories
    SET slug = CASE name
      WHEN 'Culture' THEN 'culture'
      WHEN 'Nature' THEN 'nature'
      WHEN 'Loisirs' THEN 'loisirs'
      WHEN 'Sport' THEN 'sport'
      WHEN 'Restauration' THEN 'restauration'
      ELSE lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
    END
    WHERE slug IS NULL;
  `);

  pgm.alterColumn('categories', 'slug', { notNull: true });
  pgm.createIndex('categories', 'slug', { unique: true });
};

exports.down = (pgm) => {
  pgm.dropIndex('categories', 'slug');
  pgm.dropColumn('categories', 'slug');
};