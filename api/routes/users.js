const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.json({ users: [{ name: 'e-baron' }] });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM project.users WHERE pseudo = $1', [username]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if (validPassword) {
        res.status(200).json({ message: 'Connexion réussie' });
      } else {
        res.status(400).json({ message: 'Mot de passe incorrect' });
      }
    } else {
      res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await pool.query('INSERT INTO project.users (pseudo, password) VALUES ($1, $2)', [username, passwordHash]);
    if (user.rowCount > 0) {
      res.status(200).json({ message: 'Connexion réussie register' });
    } else {
      res.status(400).send('Erreur lors de l’enregistrement de l’utilisateur');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
