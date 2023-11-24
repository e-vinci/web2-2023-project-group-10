const { client } = require('../app');

function readAllReponses() {
  return client.query('SELECT * FROM reponses');
}

function readOneReponse(reponseId) {
  return client.query('SELECT * FROM reponses WHERE id_reponse = $1', [reponseId]);
}

function createOneReponse(questionId, libelle, isRight) {
  return client.query('INSERT INTO reponses (id_reponse, id_question, libelle, est_correcte) VALUES (DEFAULT, $1, $2, $3) RETURNING *', [questionId, libelle, isRight]);
}

function deleteOneReponse(reponseId) {
  return client.query('DELETE FROM reponses WHERE id_reponse = $1', [reponseId]);
}

function updateOneReponse(reponseId, questionId, libelle, isRight) {
  return client.query('UPDATE reponses SET id_question = $2, libelle = $3, est_correcte = $4 WHERE id_reponse = $1 RETURNING *', [reponseId, questionId, libelle, isRight]);
}

module.exports = {
  readAllReponses,
  readOneReponse,
  createOneReponse,
  deleteOneReponse,
  updateOneReponse,
};
