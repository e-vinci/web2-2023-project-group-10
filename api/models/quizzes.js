/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
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
    [user, categoryId, title],
  );
  if (quiz.rows.length > 0) {
    console.log('Quiz add successfully.');
    return quiz.rows;
  }
  return undefined;
}

async function addQuestionsAnswers(questions, quizId) {
  console.log('questions.lenght : ', questions.length);
  for (let index = 0; index < questions.length; index++) {
    console.log('the question is : ', questions[index][0]);
    const question = await pool.query(
      'INSERT INTO project.questions (quiz_id, question) VALUES ($1, $2) RETURNING  question_id ',
      [quizId, questions[index][0]],
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
          [questions[index][j], questionId, 1],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      } else {
        const answer = await pool.query(
          'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
          [questions[index][j], questionId, 0],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      }
    }
  }
  return { message: 'Questions and answers added successfully.' };
}
module.exports = {
  readAllQuizzesByUser,
  readCategoryByLabel,
  readAllCategories,
  addOneQuiz,
  addQuestionsAnswers,
};
