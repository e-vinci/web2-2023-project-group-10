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
} = require('../models/quizzes');

/**
 *  Return all quizzes for a user.
 *  user-id: The user's ID passed as a query parameter.
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
*/

// faut encore ameliorer //

/**
 *  Return all quizzes for a user.
 *  user-id: The user's ID passed as a query parameter.
 *  Return all quizzes for a category.
 *  label : The label's category passed as a query parameter
 * */
router.get('/', async (req, res) => {
  const userId = req?.query ? Number(req.query['user-id']) : undefined;
  const categoryName = req?.query ? req.query.label : undefined;
  try {
    if (!Number.isNaN(userId)) {
      const quizzes = await readAllQuizzesByUser(userId);
      console.log(quizzes);
      if (quizzes !== undefined) return res.json(quizzes);
      return res.sendStatus(400);
    } if (categoryName !== undefined) {
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
router.post('/', async (req, res) => {
  console.log('POST routes/quizzes');
  const {
    title,
    category,
    questions,
    currentUser,
  } = req.body;

  console.log(currentUser);

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
    const quiz = await addOneQuiz(categoryId, title, currentUser);
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
