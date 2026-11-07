import pool from '../db.js';

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
    activity.address,                // $4 : Ajouté ici !
    activity.latitude,               // $5
    activity.longitude,              // $6
    activity.website,                // $7
    activity.free === null ? null : !activity.free, // $8
    activity.indoor === null ? null : (activity.indoor ? 'indoor' : 'outdoor'), // $9
    JSON.stringify(activity.osm_tags), // $10
    activity.osm_tags?.opening_hours || null // $11
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