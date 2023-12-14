const pool = require('../db');

async function getUserBadges(id) {
  try {
    const badges = await pool.query(
      'SELECT * FROM project.user_badges ub, project.badges b WHERE ub.user_id = $1 AND ub.badge_id = b.badge_id',
      [id],
    );
    if (badges && badges.rows.length > 0) {
      console.log('Badges retrieved successfully');
      console.log(badges.rows);
      return badges.rows;
    }
    return undefined; //  []
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
}

async function getAllBadges() {
  try {
    console.log('getAllBadges');
    const allBadges = await pool.query('SELECT * FROM  project.badges ORDER BY badge_id  ASC');
    if (allBadges.rows.length > 0) {
      console.log('Badges retrieved successfully');
      return allBadges.rows;
    }
    return undefined; //  []
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
}
async function addOneBadgeToUser(currentUser, label) {
  console.log('je suis dans addOneBadgeToUser ');
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
