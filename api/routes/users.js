const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.json({ users: [{ name: 'e-baron' }] });
});

/* test */
router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Connexion réussie login' });
});

/* test */
router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Connexion réussie register' });
});

module.exports = router;
