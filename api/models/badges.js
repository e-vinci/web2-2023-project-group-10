const pool = require('../db');

/**
 * Return all the badges for a user
 * id : the id of the user
 */
async function getUserBadges(id) {
  console.log('getUserBadges in api/models/badges.js');

  try {
    const badges = await pool.query(
      'SELECT * FROM project.user_badges ub, project.badges b WHERE ub.user_id = $1 AND ub.badge_id = b.badge_id',
      [id],
    );
    if (badges && badges.rows.length > 0) {
      console.log('Badges retrieved successfully');
      return badges.rows;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
}

/**
 * Return all the badges of the database
 */
async function getAllBadges() {
  console.log('getAllBadges in api/models/badges.js');

  try {
    console.log('getAllBadges');
    const allBadges = await pool.query('SELECT * FROM  project.badges ORDER BY badge_id  ASC');
    if (allBadges.rows.length > 0) {
      console.log('Badges retrieved successfully');
      return allBadges.rows;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
}

/**
 * Add a badge to a user
 * currentUser : the id of the current user
 * label : the label of the badge to add
 */
async function addOneBadgeToUser(currentUser, label) {
  console.log('addOneBadgeToUser in api/models/badges.js');
  console.log('Adding badge to user:', currentUser, label);

  const idBadgeResult = await pool.query('SELECT badge_id FROM project.badges WHERE label = $1', [
    label,
  ]);

  if (idBadgeResult.rows.length > 0) {
    const idBadge = idBadgeResult.rows[0].badge_id;
    console.log('idBadge', idBadge);

    const insertResult = await pool.query(
      'INSERT INTO project.user_badges (user_id, badge_id) VALUES ($1, $2)',
      [currentUser, idBadge],
    );

    if (insertResult.rowCount > 0) {
      console.log('Badge added successfully.');
      return insertResult.rows;
    }
  }
  return undefined;
}
module.exports = {
  getUserBadges,
  getAllBadges,
  addOneBadgeToUser,
};
