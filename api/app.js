const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const pg = require('pg');

// eslint-disable-next-line no-trailing-spaces
// Remplacez la ligne User & default database par celui de elephantsql 
const conString = 'postgres://btuuybgk:1IQDmJBcwY7B0AXs-mgMj1GNum5WOdmn@ella.db.elephantsql.com/btuuybgk';
const client = new pg.Client(conString);
// eslint-disable-next-line max-len
// eslint-disable-next-line prefer-arrow-callback, func-names, consistent-return, space-before-function-paren
client.connect(function(err) {
  if (err) {
    // eslint-disable-next-line no-console
    return console.error('Could not connect to PostgreSQL', err);
  }
  // eslint-disable-next-line no-console
  console.log('Connected to PostgreSQL database');
});

const corsOptions = {
  origin: ['http://localhost:8080', 'https://e-baron.github.io'],
};

const usersRouter = require('./routes/users');
const pizzaRouter = require('./routes/pizzas');
const authsRouter = require('./routes/auths');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/pizzas', pizzaRouter);
app.use('/auths', authsRouter);

module.exports = app;
