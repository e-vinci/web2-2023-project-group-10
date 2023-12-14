/* eslint-disable no-console */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();

const { getUserBadges, getAllBadges, addOneBadgeToUser } = require('../models/badges');

router.get('/', async (req, res) => {
  const userId = req?.query ? Number(req.query['user-id']) : undefined;
  try {
    if (userId) {
      const badges = await getUserBadges(userId);
      if (badges !== undefined) {
        console.log('Badges retrieved successfully.');
        return res.json(badges);
      }
    } else {
      const badges = await getAllBadges();
      if (badges !== undefined) {
        console.log('Badges retrieved successfully.');
        return res.json(badges);
      }
    }
    return res.sendStatus(400);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});
router.post('/', async (req, res) => {
  const { label, id } = req.body;
  console.log('label', label);
  console.log('currentUser', id);
  if (!label || !id) {
    return res.status(400).json({ message: 'Erreur' });
  }
  try {
    console.log('OKOKOKOKOKOKOKOKOK');
    const badges = await addOneBadgeToUser(id, label);
    console.log('badgesssss', badges);
    if (badges !== undefined) {
      console.log('Badges retrieved successfully.');
      return res.json(badges);
    }
    console.log('Badges reeereur.');
    return res.sendStatus(400);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
