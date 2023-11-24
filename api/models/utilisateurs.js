const { client } = require('../app');

function readAllUsers() {
  return client.query('SELECT * FROM utilisateurs');
}

function readOneUser(userId) {
  return client.query('SELECT * FROM utilisateurs WHERE id_utilisateur = $1', [userId]);
}

function createOneUser(pseudo, mdp) {
  return client.query('INSERT INTO utilisateurs (id_utilisateur, pseudo, mot_de_passe) VALUES (DEFAULT, $1, $2) RETURNING *', [pseudo, mdp]);
}

function deleteOneUser(userId) {
  return client.query('DELETE FROM utilisateurs WHERE id_utilisateurs = $1', [userId]);
}

function updateOneUser(userId, pseudo, mpd) {
  return client.query('UPDATE utilisateurs SET pseudo = $2, mot_de_passe = $3 WHERE id_utilisateurs = $1 RETURNING *', [userId, pseudo, mpd]);
}

module.exports = {
  readAllUsers,
  readOneUser,
  createOneUser,
  deleteOneUser,
  updateOneUser,
};
