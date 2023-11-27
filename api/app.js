const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'https://e-baron.github.io'],
};

const usersRouter = require('./routes/users');
const quizzesRouter = require('./routes/quizzes');
const pizzaRouter = require('./routes/pizzas');
const authsRouter = require('./routes/auths');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/pizzas', pizzaRouter);
app.use('/auths', authsRouter);

module.exports = app;
