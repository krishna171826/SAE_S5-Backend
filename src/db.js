import 'dotenv/config';
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

// Fonction utilitaire pour patienter
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fonction de test avec tentatives automatiques (Retry)
async function connectWithRetry(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Connexion à PostgreSQL réussie avec succès !');
      client.release();
      return;
    } catch (err) {
      console.warn(`Tentative ${i + 1}/${retries} : PostgreSQL démarre, nouvelle tentative dans 2s...`);
      if (i === retries - 1) {
        console.error('Erreur critique : Impossible de se connecter à PostgreSQL :', err.stack);
      } else {
        await sleep(delay);
      }
    }
  }
}

// Lancer la vérification de connexion au démarrage
connectWithRetry();

export default pool;