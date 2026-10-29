exports.up = (pgm) => {
  // Table des utilisateurs
  pgm.createTable('users', {
    id: 'id', // Crée automatiquement un identifiant unique (bigint/serial)
    name: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });

  // Table des catégories d'activités
  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' }
  });

  // Table des algorithmes
  pgm.createTable('algorithms', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });

  pgm.sql(`
    INSERT INTO algorithms (name) 
    VALUES 
      ('scoring'),
      ('graphe');
  `);
};

exports.down = (pgm) => {
  // En cas d'annulation, on supprime les tables
  pgm.dropTable('algorithms');
  pgm.dropTable('categories');
  pgm.dropTable('users');
};