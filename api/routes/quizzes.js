/* eslint-disable no-console */
const express = require('express');
const pool = require('../db');

const router = express.Router();

// eslint-disable-next-line consistent-return
router.get('/categories', async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM project.categories');
    if (categories.rows.length > 0) {
      console.log('categories ok');
      return res.json(categories.rows);
    } return res.sendStatus(400);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
