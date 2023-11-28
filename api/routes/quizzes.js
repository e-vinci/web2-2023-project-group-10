/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

const {
  readAllQuizzesByUser,
  readAllCategories,
  readCategoryByLabel,
  addOneQuiz,
  addQuestionsAnswers,
} = require('../models/quizzes');

/**
 *  Return all quizzes for a user.
 *  user-id: The user's ID passed as a query parameter.
 */
router.get('/', async (req, res) => {
  const userId = req?.query ? Number(req.query['user-id']) : undefined;
  try {
    const quizzes = await readAllQuizzesByUser(userId);
    console.log(quizzes);
    if (quizzes !== undefined) return res.json(quizzes);
    return res.sendStatus(400);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * Create a new quiz.
 * title : The title of the quiz.
 * category : The category label for the quiz.
 * questions : An array of questions and their corresponding answers.
 */
router.post('/', async (req, res) => {
  console.log('POST routes/quizzes');
  const { title, category, questions } = req.body;
  try {
    // recover the selected category
    const categorySelected = await readCategoryByLabel(category);
    if (!categorySelected) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryId = categorySelected[0].category_id;
    console.log(`id category :  ${categoryId}`);
    // add the quiz to the quiz table
    const quiz = await addOneQuiz(categoryId, title, 6); // a changer par l'utilisateur courant !!
    const quizId = quiz[0].quiz_id;
    if (!quizId) {
      return res.status(400).send('Erreur lors de l’enregistrement du quiz');
    }
    console.log('Quiz created with ID:', quizId);
    const questionsAnswers = await addQuestionsAnswers(questions, quizId);
    if (!questionsAnswers) {
      return res.status(400).send('Erreur lors de l’enregistrement des questions-réponses');
    }
    return res.status(201).json(quiz[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * Return all the catgories of the database
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await readAllCategories();
    if (categories !== undefined) {
      console.log('categories : ', categories);
      return res.json(categories);
    }
    return res.sendStatus(404);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

router.delete('/:id', (req, res) => {
  const deletedQuiz = deleteOneQuiz(req.params.id);

  if (!deletedQuiz) return res.sendStatus(404);

  return res.json(deletedQuiz);
});

module.exports = router;
