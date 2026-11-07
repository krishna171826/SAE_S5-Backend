
export async function upsertActivity(client, activity) {
  const query = `
    INSERT INTO activities (
      osm_id, osm_type, name, address, latitude, longitude, website, fee,
      indoor_outdoor, osm_tags, opening_hours
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    ON CONFLICT (osm_type, osm_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      address = EXCLUDED.address,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      website = EXCLUDED.website,
      fee = EXCLUDED.fee,
      indoor_outdoor = EXCLUDED.indoor_outdoor,
      osm_tags = EXCLUDED.osm_tags,
      opening_hours = EXCLUDED.opening_hours,
      imported_at = NOW()
    RETURNING id;
  `;

  const values = [
    activity.osm_id,
    activity.osm_type,
    activity.name,
    activity.address,
    activity.latitude,
    activity.longitude,
    activity.website,
    activity.free === null ? null : !activity.free,
    activity.indoor === null ? null : (activity.indoor ? 'indoor' : 'outdoor'),
    JSON.stringify(activity.osm_tags),
    activity.osm_tags?.opening_hours || null
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

// Associer une activité à ses catégories
export async function linkActivityCategories(client, activityId, categoryNames) {

  // Supprimer les anciennes associations
  await client.query(
    'DELETE FROM activities_categories WHERE activity_id = $1',
    [activityId]
  );

  // Arrêter si aucune catégorie
  if (!categoryNames || categoryNames.length === 0) return;

  // Récupérer les catégories existantes
  const result = await client.query(
    'SELECT id FROM categories WHERE name = ANY($1::text[])',
    [categoryNames]
  );

  // Enregistrer les nouvelles associations
  for (const category of result.rows) {
    await client.query(
      `INSERT INTO activities_categories (activity_id, category_id)
       VALUES ($1, $2)`,
      [activityId, category.id]
    );
  }
}
