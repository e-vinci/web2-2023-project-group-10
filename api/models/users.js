// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const path = require('node:path');
// const { parse, serialize } = require('../utils/json');
const pool = require('../db');

module.exports = {
  getAllUsers,
  loginUser,
  registerUser,
};

async function getAllUsers() {
  const users = await pool.query(
    'SELECT * FROM project.users ORDER BY total_point DESC, pseudo ASC, user_id ASC',
  );
  if (users.rows.length > 0) {
    console.log('Users retrieved successfully');
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
