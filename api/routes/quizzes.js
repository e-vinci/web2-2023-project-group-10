/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const pool = require('../db');

const router = express.Router();
const { readAllQuizzesByUser } = require('../models/quizzes');

router.get('/', async (req, res) => {
  const userId = req?.query ? Number(req.query['user-id']) : undefined;
  try {
    const quizzes = await readAllQuizzesByUser(userId);
    // quand on appel une focntion asyn, obliger de mettre await ici !!
    console.log(quizzes);
    if (quizzes !== undefined) return res.json(quizzes);
    return res.sendStatus(400);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

router.post('/', async (req, res) => {
  console.log('POST routes/quizzes');
  const { title, category, questions } = req.body;
  try {
    // recover the selected category
    const resCategory = await pool.query('SELECT * FROM project.categories WHERE label = $1', [
      category,
    ]);
    const selectedCategory = resCategory.rows[0];
    if (!selectedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    const categoryId = selectedCategory.category_id;
    console.log(`id category :  ${categoryId}`);

    // add the quiz to the quiz table
    const quiz = await pool.query(
      'INSERT INTO project.quizzes (user_id, category, title) VALUES ($1, $2, $3) RETURNING  quiz_id, title, category',
      [6, categoryId, title], // a changer par l'id de 'lutilisateur courant !!
    );
    const quizId = quiz.rows[0].quiz_id;
    console.log("Le quiz créé à l'id :", quizId);
    if (quiz.rowCount <= 0) {
      res.status(400).send('Erreur lors de l’enregistrement du quiz');
    }
    // add questions to the question table :
    console.log('la longueur de questions : ', questions.length);
    for (let index = 0; index < questions.length; index++) {
      console.log('the question is : ', questions[index][0]);
      const question = await pool.query(
        'INSERT INTO project.questions (quiz_id, question) VALUES ($1, $2) RETURNING  question_id ',
        [quizId, questions[index][0]],
      );
      if (question.rowCount <= 0) {
        res.status(400).send('Erreur lors de l’enregistrement de la question');
      }
      const questionId = question.rows[0].question_id;
      // add the answers to the question table :
      for (let j = 1; j <= 4; j++) {
        if (j === 1) {
          const answer = await pool.query(
            'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
            [questions[index][j], questionId, 1],
          );
          if (answer.rowCount <= 0) {
            res.status(400).send('Erreur lors de l’enregistrement d une reponse');
          }
        } else {
          const answer = await pool.query(
            'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
            [questions[index][j], questionId, 0],
          );
          if (answer.rowCount <= 0) {
            res.status(400).send('Erreur lors de l’enregistrement d une reponse');
          }
        }
      }
    }
    return res.status(201).json(quiz.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

// eslint-disable-next-line consistent-return
router.get('/categories', async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM project.categories');
    if (categories.rows.length > 0) {
      console.log('categories ok');
      return res.json(categories.rows);
    }
    return res.sendStatus(400);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});

// Read all quizzes by user_id
router.get('/:id_user', async (req, res) => {
  const userId = req.params.id_user;
  try {
    const quizzes = await pool.query('SELECT * FROM project.quizzes WHERE user_id=$1', [
      userId, // a remplcer par l'id de l'user (session)
    ]);
    if (quizzes.rows.length > 0) {
      console.log('quizzes ok');
      return res.json(quizzes.rows);
    }
    return res.sendStatus(400);
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
