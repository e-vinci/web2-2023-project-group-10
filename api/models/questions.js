const { pool } = require('../db_connect');

function readAllQuestions() {
  return pool.query('SELECT * FROM projet.questions');
}

function readOneQuestion(questionId) {
  return pool.query('SELECT * FROM projet.questions WHERE id_question = $1', [questionId]);
}

function createOneQuestion(quizzId, libelle) {
  return pool.query('INSERT INTO projet.questions (quizz_id, libelle) VALUES ($1, $2) RETURNING *', [quizzId, libelle]);
}

function deleteOneQuestion(questionId) {
  return pool.query('DELETE FROM projet.questions WHERE id_question = $1', [questionId]);
}

function updateOneQuestion(questionId, libelle, quizzId) {
  return pool.query('UPDATE projet.questions SET libelle = $2, quizz_id = $3 WHERE id_question = $1 RETURNING *', [questionId, libelle, quizzId]);
}

module.exports = {
  readAllQuestions,
  readOneQuestion,
  createOneQuestion,
  deleteOneQuestion,
  updateOneQuestion,
};
