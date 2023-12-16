const express = require('express');

const router = express.Router();

const { getUserBadges, getAllBadges, addOneBadgeToUser } = require('../models/badges');

/**
 * Return all the badges for a user or all badges if no userId is provided
 * user-id : the id of the user
 */
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
  return res.sendStatus(400);
});

/**
 * Add a badge to a user
 * label : the label of the badge to add
 * id : the id of the current user
 */
router.post('/', async (req, res) => {
  const { label, id } = req.body;
  console.log('label : ', label);
  console.log('currentUser : ', id);
  if (!label || !id) {
    return res.status(400).json({ message: 'Erreur' });
  }
  try {
    const badges = await addOneBadgeToUser(id, label);
    if (badges !== undefined) {
      console.log('Badges added successfully.');
      return res.json(badges);
    }
    return res.sendStatus(400);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
  return res.sendStatus(400);
});

module.exports = router;
