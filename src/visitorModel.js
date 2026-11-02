import pool from '../db.js';

export const createVisitor = async (firstName) => {
  const query = `
    INSERT INTO users (first_name)
    VALUES ($1)
    RETURNING id, first_name, created_at;
  `;
  const values = [firstName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};