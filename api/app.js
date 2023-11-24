const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { pool } = require('./db_connect');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://e-baron.github.io'],
};

// Example: Using client for testing the connection + no ESLint no error
pool.query('SELECT * FROM projet.questions', (err, result) => {
  if (err) {
    console.error('Error executing query:', err);
  } else {
    console.log('Query result:', result.rows);
  }
});

const questionRouter = require('./routes/questions');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/questions', cors(corsOptions), questionRouter);

module.exports = app;
