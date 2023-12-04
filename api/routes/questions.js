const express = require('express');
const pool = require('../db');

const router = express.Router();

// Read the question identified by its id
router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    return res.status(400).json({ error: 'Missing questionId parameter' });
  }

  try {
    const foundQuestion = await pool.query('SELECT * FROM project.questions WHERE question_id = $1', [questionId]);

    if (!foundQuestion.rows.length) {
      return res.sendStatus(404);
    }
    return res.json(foundQuestion.rows[0]);
  } catch (error) {
    console.error('Error fetching question:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// Read the questions identified by the quiz id
router.get('/quiz/:quizId', async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    return res.status(400).json({ error: 'Missing quizId parameter' });
  }

  try {
    const foundQuestions = await pool.query('SELECT * FROM project.questions WHERE quiz_id = $1', [quizId]);

    if (!foundQuestions.rows.length) {
      return res.sendStatus(404);
    }
    return res.json(foundQuestions.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
