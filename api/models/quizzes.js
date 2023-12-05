/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const escape = require('escape-html');
const pool = require('../db');

/**
 * Retrieves all quizzes for a user based on the user's ID.
 * If quizzes are found, returns an array of quiz objects.
 * If no quizzes are found, returns undefined.
 * userId : The user's ID.
 */
async function readAllQuizzesByUser(userId) {
  const quizzes = await pool.query('SELECT * FROM project.quizzes WHERE user_id=$1', [userId]);
  if (quizzes.rows.length > 0) {
    console.log('quizzes ok');
    return quizzes.rows;
  }
  return undefined;
}

/**
 * Retrieves a category based on its label.
 * If a category is found, returns an array with the category object.
 * If no category is found, returns undefined.
 * label : The label of the category.
 */
async function readCategoryByLabel(label) {
  const category = await pool.query('SELECT * FROM project.categories WHERE label = $1', [label]);
  if (category.rows.length > 0) {
    console.log(`Category ${label} retrieved successfully.`);
    return category.rows;
  }
  return undefined;
}

/**
 * Retrieves all categories from the database.
 * If categories are found, returns an array of category objects.
 * If no categories are found, returns undefined.
 */
async function readAllCategories() {
  const categories = await pool.query('SELECT * FROM project.categories');
  if (categories.rows.length > 0) {
    console.log('Categories retrieved successfully.');
    return categories.rows;
  }
  return undefined;
}

async function addOneQuiz(categoryId, title, user) {
  const quiz = await pool.query(
    'INSERT INTO project.quizzes (user_id, category, title) VALUES ($1, $2, $3) RETURNING  quiz_id, title, category',
    [user, categoryId, escape(title)],
  );
  console.log('API- models- quizzes.js');
  console.log(user);
  if (quiz.rows.length > 0) {
    console.log('Quiz add successfully.');
    return quiz.rows;
  }
  return undefined;
}
/*
questions : a table that contains questions and answers
*/
async function addQuestionsAnswers(questions, quizId) {
  console.log('questions.lenght : ', questions.length);
  for (let index = 0; index < questions.length; index++) {
    console.log('the question is : ', questions[index][0]);
    const question = await pool.query(
      'INSERT INTO project.questions (quiz_id, question) VALUES ($1, $2) RETURNING  question_id ',
      [quizId, escape(questions[index][0])],
    );
    if (question.rowCount <= 0) {
      return undefined;
    }
    const questionId = question.rows[0].question_id;
    // add the answers to the question table :
    for (let j = 1; j <= 4; j++) {
      if (j === 1) {
        const answer = await pool.query(
          'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
          [escape(questions[index][j]), questionId, 1],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      } else {
        const answer = await pool.query(
          'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
          [escape(questions[index][j]), questionId, 0],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      }
    }
  }
  return { message: 'Questions and answers added successfully.' };
}

async function deleteOneQuiz(quizId) {
  console.log('hello world');
  console.log(quizId);

  try {
    console.log('effacer plusieurs réponses');
    const deleteAnswersQuery = `
      DELETE FROM project.answers
      WHERE question IN (
        SELECT question_id
        FROM project.questions
        WHERE quiz_id = $1
      )`;
    let quizResult = await pool.query(deleteAnswersQuery, [quizId]);

    const deleteQuestionsQuery = 'DELETE FROM project.questions WHERE quiz_id = $1';
    quizResult = await pool.query(deleteQuestionsQuery, [quizId]);

    const deleteQuizQuery = 'DELETE FROM project.quizzes WHERE quiz_id = $1';
    quizResult = await pool.query(deleteQuizQuery, [quizId]);
    return quizResult.rowCount;
  } catch (err) {
    console.error('Deletion failed:', err);
  }
}

/**
 * Retrieve all quizzes by selected category name
 * If quizzes are found, returns an array of quiz objects.
 * If no quizzes are found, returns undefined.
 * categoryName : The label of the category.
 */
async function readAllQuizzesByCategory(categoryName) {
  const quizzesInCategory = await pool.query(
    'SELECT q.title, u.pseudo, c.label, q.quiz_id FROM project.quizzes q, project.users u,project.categories c WHERE c.category_id = q.category AND u.user_id = q.user_id AND c.label = $1',
    [categoryName],
  );
  if (quizzesInCategory.rows.length > 0) {
    console.log('quizzes par catégorie OK');
    return quizzesInCategory.rows;
  }
  return undefined;
}

module.exports = {
  readAllQuizzesByUser,
  readCategoryByLabel,
  readAllCategories,
  addOneQuiz,
  addQuestionsAnswers,
  deleteOneQuiz,
  readAllQuizzesByCategory,
};
