const { client } = require('../app');

function readAllQuiz() {
  return client.query('SELECT * FROM quiz');
}

function readOneReponse(reponseId) {
  return client.query('SELECT * FROM reponses WHERE id_quiz = $1', [reponseId]);
}

function createOneQuiz(categoryId, userId) {
  return client.query('INSERT INTO quiz (id_quiz, id_categorie, id_utilisateur) VALUES (DEFAULT, $1, $2) RETURNING *', [categoryId, userId]);
}

function deleteOneQuiz(quizId) {
  return client.query('DELETE FROM quiz WHERE id_quiz = $1', [quizId]);
}

function updateOneQuiz(quizId, categoryId, userId) {
  return client.query('UPDATE quiz SET id_categorie = $2, id_utilisateur = $3 WHERE id_quiz = $1 RETURNING *', [quizId, categoryId, userId]);
}

module.exports = {
  readAllQuiz,
  readOneQuiz: readOneReponse,
  createOneQuiz,
  deleteOneQuiz,
  updateOneQuiz,
};
