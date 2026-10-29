import pg from 'pg';
const { Pool } = pg;

const pool = new Pool(process.env.DB_HOST ? {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
} : {
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.stack);
  } else {
    console.log('Connexion à PostgreSQL réussie avec succès !');
  }
  if (client) release();
});

export default pool;
