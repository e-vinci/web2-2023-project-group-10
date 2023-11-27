/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const pool = require('../db');

const router = express.Router();

// Read the questions identified by the quiz id
router.get('/:quizId', async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    return res.status(400).json({ error: 'Missing quizId parameter' });
  }

  const foundQuestion = await pool.query('SELECT * FROM projet.questions WHERE quiz = $1', [quizId]);

  if (!foundQuestion) {
    return res.sendStatus(404);
  }
  return res.json(foundQuestion);
});

module.exports = router;
