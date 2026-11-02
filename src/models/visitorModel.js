import pool from '../db.js';

export const createVisitor = async (firstName) => {
  const query = `
    INSERT INTO users (name)
    VALUES ($1)
    RETURNING id, name, created_at;
  `;
  const values = [firstName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};