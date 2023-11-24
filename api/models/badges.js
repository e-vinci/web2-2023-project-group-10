const { client } = require('../app');

function readAllBadges() {
  return client.query('SELECT * FROM badges');
}

function readOneBadge(badgeId) {
  return client.query('SELECT * FROM badges WHERE id_badge = $1', [badgeId]);
}

function createOneBadge(libelle) {
  return client.query('INSERT INTO badges (id_badge, libelle,) VALUES (DEFAULT, $1) RETURNING *', [libelle]);
}

function deleteOneBadge(badgeId) {
  return client.query('DELETE FROM badges WHERE id_badge = $1', [badgeId]);
}

function updateOneBadge(badgeId, libelle) {
  return client.query('UPDATE badges SET libelle = $2 WHERE id_badge = $1 RETURNING *', [badgeId, libelle]);
}

module.exports = {
  readAllBadges,
  readOneBadge,
  createOneBadge,
  deleteOneBadge,
  updateOneBadge,
};
