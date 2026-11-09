
exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO categories (name)
    VALUES
      ('Culture'),
      ('Nature'),
      ('Loisirs'),
      ('Sport'),
      ('Restauration');
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM categories
    WHERE name IN (
      'Culture',
      'Nature',
      'Loisirs',
      'Sport',
      'Restauration'
    );
  `);
};
