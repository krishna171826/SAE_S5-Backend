import express from "express";
import pool from './db.js'; // sert à activer la connexion du fichier db
import categoryRoutes from './routes/categoryRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';

const app = express();

app.use(express.json());

// Enregistrement des routes
app.use("/api/categories", categoryRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api', visitorRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: "Connexion à la base de données réussie !",
      heure_postgres: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible de communiquer avec la base" });
  }
});

app.get('/activities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur avec la table activities" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Express démarré sur le port 3000");
});