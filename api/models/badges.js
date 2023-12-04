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

module.exports = {
  getUserBadges,
};
