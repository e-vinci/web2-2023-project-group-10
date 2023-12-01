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

  const foundAnswers = await pool.query('SELECT * FROM project.answers WHERE question = $1', [questionId]);

  if (!foundAnswers) {
    return res.sendStatus(404);
  }
  return res.json(foundAnswers.rows);
});

// Get if an answer is correct or not given its Id
router.get('/isTrue/:answerId', async (req, res) => {
  const { answerId } = req.params;

  if (!answerId) {
    return res.status(400).json({ error: 'Missing answerId parameter' });
  }

  const isCorrect = await pool.query('SELECT is_correct FROM project.answers WHERE id_answer = $1', [answerId]);

  if (isCorrect === null) {
    return res.sendStatus(404);
  }
  return res.json(isCorrect);
});

module.exports = router;
