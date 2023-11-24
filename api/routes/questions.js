const express = require('express');
const {
  readAllQuestions,
  readOneQuestion,
  createOneQuestion,
  deleteOneQuestion,
  updateOneQuestion,
} = require('../models/questions');
const { authorize, isAdmin } = require('../utils/auths');

const router = express.Router();
console.log('ACCESSING QUESTIONS');

// Read all the questions from the menu
router.get('/', (req, res) => {
  try {
    const allQuestionsPotentiallyOrdered = readAllQuestions();
    return res.json(allQuestionsPotentiallyOrdered);
  } catch (error) {
    console.error('Error reading all questions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read the question identified by its id
router.get('/:id', (req, res) => {
  const foundQuestion = readOneQuestion(req.params.id);

  if (!foundQuestion) return res.sendStatus(404);

  return res.json(foundQuestion);
});

// Create a question to be added to the menu.
router.post('/', authorize, isAdmin, (req, res) => {
  const libelle = req?.body?.libelle?.length !== 0 ? req.body.libelle : undefined;
  const quizzId = req?.body?.quizzId;

  if (!libelle || !quizzId) return res.sendStatus(400); // error code '400 Bad request'

  const createdQuestion = createOneQuestion(quizzId, libelle);

  return res.json(createdQuestion);
});

// Delete a question from the menu based on its id
router.delete('/:id', authorize, isAdmin, (req, res) => {
  const deletedQuestion = deleteOneQuestion(req.params.id);

  if (!deletedQuestion) return res.sendStatus(404);

  return res.json(deletedQuestion);
});

// Update a question based on its id and new values for its parameters
router.patch('/:id', authorize, isAdmin, (req, res) => {
  const libelle = req?.body?.libelle;
  const quizzId = req?.body?.quizzId;

  if ((!libelle && !quizzId) || libelle?.length === 0) {
    return res.sendStatus(400);
  }

  const updatedQuestion = updateOneQuestion(req.params.id, libelle, quizzId);

  if (!updatedQuestion) return res.sendStatus(404);

  return res.json(updatedQuestion);
});

module.exports = router;
