import pool from '../db/pool.js';

export async function upsertActivity(client, activity) {
  const query = `
    INSERT INTO activities (
      osm_id, osm_type, name, location, website, phone, free, indoor, osm_tags
    ) VALUES (
      $1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7, $8, $9, $10
    )
    ON CONFLICT (osm_type, osm_id) 
    DO UPDATE SET 
      name = EXCLUDED.name,
      location = EXCLUDED.location,
      website = EXCLUDED.website,
      phone = EXCLUDED.phone,
      free = EXCLUDED.free,
      indoor = EXCLUDED.indoor,
      osm_tags = EXCLUDED.osm_tags,
      updated_at = NOW()
    RETURNING id;
  `;

  const values = [
    activity.osm_id,
    activity.osm_type,
    activity.name,
    activity.longitude, // PostGIS : longitude puis latitude
    activity.latitude,
    activity.website,
    activity.phone,
    activity.free,
    activity.indoor,
    JSON.stringify(activity.osm_tags)
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

export async function linkActivityCategories(client, activityId, categoryNames) {
  if (!categoryNames || categoryNames.length === 0) return;

  await client.query('DELETE FROM activities_categories WHERE activity_id = $1;', [activityId]);

  const catQuery = 'SELECT id, name FROM categories WHERE name = ANY($1::text[]);';
  const catResult = await client.query(catQuery, [categoryNames]);

  for (const cat of catResult.rows) {
    const insertLink = `
      INSERT INTO activities_categories (activity_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    await client.query(insertLink, [activityId, cat.id]);
  }
}