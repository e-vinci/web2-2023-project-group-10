/* eslint-disable consistent-return */
const escape = require('escape-html');
const express = require('express');
const jwt = require('jsonwebtoken');
const { authorize } = require('../utils/auths');

const router = express.Router();
const secretToken = 'soislechangementquetuveuxvoirdanslemonde';

const {
  getAllUsers, loginUser, registerUser, updateUserPoint,
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

router.get('/details', authorize, async (req, res) => {
  const currentUser = req.user;
  const userId = currentUser.rows[0].user_id;
  const username = currentUser.rows[0].pseudo;
  const totalPoint = currentUser.rows[0].total_point;
  try {
    return res.json({ userID: userId, userName: username, userPoint: totalPoint });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).send('Le champ username est vide');
  }
  if (!password) {
    return res.status(400).send('Le champ password est vide');
  }

  try {
    const user = await loginUser(escape(username), password);

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

  if (!username || username.trim() === '') {
    return res.status(400).send('Le champ username est vide');
  }
  if (!password) {
    return res.status(400).send('Le champ password est vide');
  }

  try {
    const user = await registerUser(escape(username), password);
    if (user.rowCount > 0) {
      res.status(200).json({ message: 'Connexion réussie register' });
    } else {
      res.status(400).send('Erreur lors de l’enregistrement de l’utilisateur');
    }
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

router.patch('/', authorize, async (req, res) => {
  const currentUser = req.user;
  const userId = currentUser.rows[0].user_id;
  try {
    const updatedPoint = await updateUserPoint(userId, req?.body);
    if (!updatedPoint) return res.sendStatus(404);
    return res.json(updatedPoint);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});
module.exports = router;
