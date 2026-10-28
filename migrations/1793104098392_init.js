/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('utilisateurs', {
    id: 'id', // Crée automatiquement une clé primaire (un identifiant unique)
    nom: { type: 'varchar(100)', notNull: true }, // Une colonne texte obligatoire
    cree_le: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'), // Met la date du jour par défaut
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('utilisateurs'); // L'action inverse : on supprime la table
};