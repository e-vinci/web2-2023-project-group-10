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
  deleteOneQuiz,
  readAllQuizzesByCategory,
  readOneQuizDetailsByID,
} = require('../models/quizzes');

const { authorize } = require('../utils/auths');

/**
 *  Return all quizzes for a user.
 *  user-id: The user's ID passed as a query parameter.
 *  label : The label's category passed as a query parameter
 * */
router.get('/', authorize, async (req, res) => {
  const currentUser = req.user;
  const userId = currentUser.rows[0].user_id;
  // const userId = req?.query ? Number(req.query['user-id']) : undefined;
  // const categoryName = req?.query ? req.query.label : undefined;
  // const quizId = req?.query ? Number(req.query['quiz-id']) : undefined;

  try {
    if (!Number.isNaN(userId)) {
      const quizzes = await readAllQuizzesByUser(userId);
      console.log(quizzes);
      if (quizzes !== undefined) return res.json(quizzes);
      return res.sendStatus(400);
    }
    return res.sendStatus(400);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/readAllQuizzesByCategories', async (req, res) => {
  console.log('readAllQuizzesByCategories');
  const categoryName = req?.query ? req.query.label : undefined;
  const quizId = req?.query ? Number(req.query['quiz-id']) : undefined;
  console.log('categorie name dans le back ', categoryName);
  console.log('Number of quiz ', quizId);
  try {
    if (Number.isInteger(quizId)) {
      const quiz = await readOneQuizDetailsByID(quizId);
      console.log(quiz);
      if (quiz !== undefined) return res.json(quiz);
      return res.sendStatus(400);
    }
    if (categoryName !== undefined) {
      const quizzesInCategory = await readAllQuizzesByCategory(categoryName);
      console.log('quizzes', quizzesInCategory);
      if (quizzesInCategory !== undefined) return res.json(quizzesInCategory);
      return res.sendStatus(400);
    }
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
router.post('/', authorize, async (req, res) => {
  console.log('POST routes/quizzes');
  const { title, category, questions } = req.body;

  const currentUser = req.user;
  console.log('currentUser', currentUser);

  const userID = currentUser.rows[0].user_id;
  console.log('userID', userID);

  if (!title || !category || !questions || questions.length === 0) {
    return res.status(400).json({ message: 'Tous les champs du formulaire sont obligatoires' });
  }

  try {
    // recover the selected category
    const categorySelected = await readCategoryByLabel(category);
    if (!categorySelected) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryId = categorySelected[0].category_id;
    console.log(`id category :  ${categoryId}`);
    // add the quiz to the quiz table
    const quiz = await addOneQuiz(categoryId, title, userID);
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

router.delete('/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    console.log('ID du quiz à supprimer:', quizId);
    const rowCount = await deleteOneQuiz(quizId);

    if (rowCount === 0) {
      res.status(404).send('Quiz non trouvé.');
    } else {
      res.status(200).json({ message: 'Quiz supprimé avec succès.' });
    }
  } catch (err) {
    console.error('Erreur serveur lors de la suppression du quiz:', err);
    res.status(500).send('Erreur serveur.');
  }
});

module.exports = router;
