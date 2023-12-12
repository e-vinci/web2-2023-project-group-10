/* eslint-disable no-console */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();

const { getUserBadges, getAllBadges } = require('../models/badges');

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

module.exports = router;
