const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'draft',
  password: 'DIDmen2002',
  port: 5432,
});

// Use the query method to check the connected database
pool.query('SELECT current_database()', (err, result) => {
  if (err) {
    console.error('Error checking connected database:', err);
  } else {
    const connectedDatabase = result.rows[0].current_database;
    console.log('Connected to PostgreSQL database:', connectedDatabase);
  }
});

module.exports = {
  pool,
};
