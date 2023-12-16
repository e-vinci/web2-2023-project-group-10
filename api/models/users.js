// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const path = require('node:path');
// const { parse, serialize } = require('../utils/json');
const pool = require('../db');

module.exports = {
  getAllUsers,
  loginUser,
  registerUser,
  currentUser,
  updateUserPoint,
};

/**
 * Retrieves all the users of the database
 * userId : the id of the user
 */
async function getAllUsers() {
  const users = await pool.query(
    'SELECT * FROM project.users ORDER BY total_point DESC, pseudo ASC, user_id ASC',
  );
  if (users.rows.length > 0) {
    return users.rows;
  }
  return undefined;
}

async function loginUser(username, password) {
  const user = await pool.query('SELECT * FROM project.users WHERE pseudo = $1', [username]);

  if (user.rows.length > 0) {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      return user;
    }
  }
  return user;
}

async function registerUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await pool.query('INSERT INTO project.users (pseudo, password) VALUES ($1, $2)', [
    username,
    passwordHash,
  ]);

  if (user.rowCount > 0) {
    return user;
  }
  return user;
}

async function currentUser(username) {
  const user = await pool.query('SELECT * FROM project.users WHERE pseudo = $1', [username]);

  if (user.rows.length > 0) {
    return user;
  }

  return user;
}

/**
 * Update the user's points
 * userId: the id of the user
 * score: the score to be added to the user's total points
 */
async function updateUserPoint(userId, score) {
  const points = await pool.query(
    'UPDATE project.users SET total_point = total_point + $1 WHERE user_id = $2 RETURNING total_point',
    [score.score, userId],
  );
  if (points.rowCount > 0) {
    return points.rows[0].total_point;
  }
  return undefined;
}
