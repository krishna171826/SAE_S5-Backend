exports.up = (pgm) => {
  // 1. Table activities (table parente oubliée dans la première vague)
  pgm.createTable('activities', {
    id: 'id',
    osm_type: { type: 'varchar(50)' },
    osm_id: { type: 'bigint' },
    name: { type: 'varchar(255)' },
    description: { type: 'text' },
    address: { type: 'text' },
    latitude: { type: 'numeric' },
    longitude: { type: 'numeric' },
    indoor_outdoor: { type: 'varchar(50)' },
    fee: { type: 'boolean' },
    website: { type: 'text' },
    opening_hours: { type: 'text' },
    osm_tags: { type: 'jsonb' },
    imported_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    city: { type: 'varchar(255)' }
  });

  // 2. Tables de liaison (Nécessitent les tables parentes)
  pgm.createTable('user_preferences', {
    user_id: { type: 'bigint', references: '"users"', onDelete: 'CASCADE' },
    category_id: { type: 'bigint', references: '"categories"', onDelete: 'CASCADE' },
    preference_weight: { type: 'numeric' }
  });

  pgm.createTable('activities_categories', {
    activity_id: { type: 'bigint', references: '"activities"', onDelete: 'CASCADE' },
    category_id: { type: 'bigint', references: '"categories"', onDelete: 'CASCADE' }
  });

  pgm.createTable('searches', {
    id: 'id',
    user_id: { type: 'bigint', references: '"users"', onDelete: 'CASCADE' },
    address: { type: 'text' },
    latitude: { type: 'numeric' },
    longitude: { type: 'numeric' },
    radius_m: { type: 'integer' },
    indoor_outdoor: { type: 'varchar(50)' },
    free_only: { type: 'boolean' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // 3. Tables de résultats (Nécessitent les recherches et les algos)
  pgm.createTable('recommendations', {
    id: 'id',
    search_id: { type: 'bigint', references: '"searches"', onDelete: 'CASCADE' },
    activity_id: { type: 'bigint', references: '"activities"', onDelete: 'CASCADE' },
    algorithm_id: { type: 'bigint', references: '"algorithms"', onDelete: 'CASCADE' },
    score: { type: 'double precision' },
    rank_position: { type: 'integer' },
    explanation: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  pgm.createTable('algorithms_performances', {
    id: 'id',
    search_id: { type: 'bigint', references: '"searches"', onDelete: 'CASCADE' },
    algorithm_id: { type: 'bigint', references: '"algorithms"', onDelete: 'CASCADE' },
    algorithm_version: { type: 'varchar(50)' },
    activities_analyzed: { type: 'integer' },
    execution_time_ms: { type: 'numeric' },
    memory_used_mb: { type: 'numeric' },
    cpu_usage_percent: { type: 'numeric' },
    started_at: { type: 'timestamp' },
    completed_at: { type: 'timestamp' },
    status: { type: 'varchar(50)' },
    error_message: { type: 'text' }
  });
};

exports.down = (pgm) => {
  // On détruit dans le sens inverse de la création pour éviter les erreurs de clés
  pgm.dropTable('algorithms_performances');
  pgm.dropTable('recommendations');
  pgm.dropTable('searches');
  pgm.dropTable('activities_categories');
  pgm.dropTable('user_preferences');
  pgm.dropTable('activities');
};