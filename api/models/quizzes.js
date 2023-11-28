/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const pool = require('../db');

async function readAllQuizzesByUser(userId) {
  const quizzes = await pool.query('SELECT * FROM project.quizzes WHERE user_id=$1', [userId]);
  if (quizzes.rows.length > 0) {
    // console.log('quizzes ok');
    return quizzes.rows;
  }
  return undefined;
}

module.exports = {
  readAllQuizzesByUser,
};
