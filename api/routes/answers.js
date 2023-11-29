/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const pool = require('../db');

const router = express.Router();

// Read the answers identified by the question id
router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    return res.status(400).json({ error: 'Missing questionId parameter' });
  }

  const foundAnswers = await pool.query('SELECT * FROM projet.reponses WHERE question = $1', [questionId]);

  if (!foundAnswers) {
    return res.sendStatus(404);
  }
  return res.json(foundAnswers.rows);
});

module.exports = router;
