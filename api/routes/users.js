/* eslint-disable consistent-return */
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secretToken = 'soislechangementquetuveuxvoirdanslemonde ';

const {
  getAllUsers,
  loginUser,
  registerUser,
} = require('../models/users');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users) {
      return res.json(users);
    }
    return res.sendStatus(400).json({ message: 'Aucun utilisateur dans la DB' });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

router.get('/details', async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, secretToken);
    return res.json({ userID: decoded.userID, userName: decoded.userName });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);

    if (user.rows.length > 0) {
      const userID = user.rows[0].user_id;
      const userName = user.rows[0].pseudo;
      const token = jwt.sign({ userID, userName }, secretToken);

      res.status(200).json({
        message: 'Connexion réussie',
        token,
        user_id: userID,
        username: userName,
      });
    } else {
      res.status(400).json({ message: 'Pseudo incorrect ou Mot de passe incorrect' });
    }
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    if (user.rowCount > 0) {
      res.status(200).json({ message: 'Connexion réussie register' });
    } else {
      res.status(400).send('Erreur lors de l’enregistrement de l’utilisateur');
    }
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
