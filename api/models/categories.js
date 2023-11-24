const { client } = require('../app');

function readAllCategories() {
  return client.query('SELECT * FROM categories');
}

function readOneCategory(categoryId) {
  return client.query('SELECT * FROM categories WHERE id_categorie = $1', [categoryId]);
}

function createOneCategory(categoryId, libelle) {
  return client.query('INSERT INTO categories (id_categorie, libelle) VALUES ($1, $2) RETURNING *', [categoryId, libelle]);
}

function deleteOneCategory(questionId) {
  return client.query('DELETE FROM categories WHERE id_categorie = $1', [questionId]);
}

function updateOneCategory(questionId, libelle, quizzId) {
  return client.query('UPDATE categories SET libelle = $2, id_quiz = $3 WHERE id_categorie = $1 RETURNING *', [questionId, libelle, quizzId]);
}

module.exports = {
  readAllCategories,
  readOneCategory,
  createOneCategory,
  deleteOneCategory,
  updateOneCategory,
};
