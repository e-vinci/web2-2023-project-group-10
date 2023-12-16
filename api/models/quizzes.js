const escape = require('escape-html');
const pool = require('../db');

/**
 * Retrieves all quizzes for a user based on the user's ID.
 * userId : The user's ID.
 */
async function readAllQuizzesByUser(userId) {
  console.log('readAllQuizzesByUser in api/models/quizzes.js');
  const quizzes = await pool.query(
    'SELECT * FROM project.quizzes WHERE user_id=$1 ORDER BY date_creation DESC',
    [userId],
  );
  if (quizzes.rows.length > 0) {
    console.log('quizzes ok');
    return quizzes.rows;
  }
  return undefined;
}

/**
 * Retrieves a category based on its label.
 * label : The label of the category.
 */
async function readCategoryByLabel(label) {
  console.log('readCategoryByLabel in api/models/quizzes.js');
  const category = await pool.query('SELECT * FROM project.categories WHERE label = $1', [label]);
  if (category.rows.length > 0) {
    console.log(`Category ${label} retrieved successfully.`);
    return category.rows;
  }
  return undefined;
}

/**
 * Retrieves all categories from the database.
 */
async function readAllCategories() {
  console.log('readAllCategories in api/models/quizzes.js');
  const categories = await pool.query('SELECT * FROM project.categories');
  if (categories.rows.length > 0) {
    console.log('Categories retrieved successfully.');
    return categories.rows;
  }
  return undefined;
}

/**
 * Add a quiz in the database
 * categoryId : id of the category selected
 * title : the title of the quiz
 * user : the id of the current user
 */
async function addOneQuiz(categoryId, title, user) {
  console.log('addOneQuiz in api/models/quizzes.js');
  const quiz = await pool.query(
    'INSERT INTO project.quizzes (user_id, category, title) VALUES ($1, $2, $3) RETURNING  quiz_id, title, category',
    [user, categoryId, escape(title)],
  );
  if (quiz.rows.length > 0) {
    console.log('Quiz add successfully.');
    return quiz.rows;
  }
  return undefined;
}

/**
 * Add the question and answers of a quiz in the database
 * quizId : the id of the quiz to which the questions and answers belong
 * questions : a table that contains questions and answers
 */
async function addQuestionsAnswers(questions, quizId) {
  console.log('addQuestionsAnswers in api/models/quizzes.js');
  console.log('questions.lenght : ', questions.length);

  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < questions.length; index += 1) {
    // add one of the questions in the database :
    console.log('the question is : ', questions[index][0]);
    const question = await pool.query(
      'INSERT INTO project.questions (quiz_id, question) VALUES ($1, $2) RETURNING question_id ',
      [quizId, escape(questions[index][0])],
    );
    if (question.rowCount <= 0) {
      return undefined;
    }
    const questionId = question.rows[0].question_id;
    // add the answers to the question in the database :
    for (let j = 1; j <= 4; j += 1) {
      if (j === 1) {
        const answer = await pool.query(
          'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
          [escape(questions[index][j]), questionId, 1],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      } else {
        const answer = await pool.query(
          'INSERT INTO project.answers (answer, question, is_correct) VALUES ($1, $2, $3) RETURNING  answer ',
          [escape(questions[index][j]), questionId, 0],
        );
        if (answer.rowCount <= 0) {
          return undefined;
        }
      }
    }
  }
  return { message: 'Questions and answers added successfully.' };
}

/**
 * Delete a quiz in the database
 * quizId : the id of the quiz
 */
async function deleteOneQuiz(quizId) {
  console.log('deleteOneQuiz in api/models/quizzes.js');
  console.log('quizId: ', quizId);

  try {
    const deleteAnswersQuery = `
      DELETE FROM project.answers
      WHERE question IN (
        SELECT question_id
        FROM project.questions
        WHERE quiz_id = $1
      )`;
    let quizResult = await pool.query(deleteAnswersQuery, [quizId]);
    const deleteQuestionsQuery = 'DELETE FROM project.questions WHERE quiz_id = $1';
    quizResult = await pool.query(deleteQuestionsQuery, [quizId]);
    const deleteQuizQuery = 'DELETE FROM project.quizzes WHERE quiz_id = $1';
    quizResult = await pool.query(deleteQuizQuery, [quizId]);
    if (quizResult.rowCount > 0) {
      return quizResult.rowCount;
    }
    return undefined;
  } catch (err) {
    console.error('Deletion failed:', err);
  }
  return undefined;
}

/**
 * Retrieve all quizzes by category name
 * categoryName : the label of the category
 */
async function readAllQuizzesByCategory(categoryName) {
  console.log('readAllQuizzesByCategory in api/models/quizzes.js');
  const quizzesInCategory = await pool.query(
    'SELECT q.title, u.pseudo, c.label, q.quiz_id FROM project.quizzes q, project.users u,project.categories c WHERE c.category_id = q.category AND u.user_id = q.user_id AND c.label = $1',
    [categoryName],
  );
  if (quizzesInCategory.rows.length > 0) {
    console.log('quizzes par catégorie OK');
    return quizzesInCategory.rows;
  }
  return undefined;
}

/**
 * Return the questions and answers of the quiz
 * quizId : the id of the quiz
 */
async function readOneQuizDetailsByID(quizId) {
  console.log('readOneQuizDetailsByID in api/models/quizzes.js');

  // Retrieve the quiz from the database
  const quiz = await pool.query('SELECT * FROM project.quizzes WHERE quiz_id=$1', [quizId]);
  console.log('quiz', quiz);

  // Retrieve all the questions of the quiz from the database
  const questions = await pool.query('SELECT * FROM project.questions WHERE quiz_id=$1', [quizId]);
  console.log('questions', questions);

  const allquestions = questions.rows;
  console.log('allquestions', allquestions);

  const AllquestionsAnswers = [];
  /* eslint-disable no-restricted-syntax */
  // For each question, retrieve all the answers
  for (const q of allquestions) {
    let correctAnswer;
    const badAnswers = [];

    const answers = await pool.query('SELECT * FROM project.answers WHERE question=$1', [
      q.question_id,
    ]);

    answers.rows.forEach((a) => {
      if (a.is_correct) {
        // If the answer is marked as correct, assign it to the correctAnswer variable
        correctAnswer = a.answer;
      } else {
        // Else, add it to the array of incorrect answers
        badAnswers.push(a.answer);
      }
    });

    // Create an object that contains a question and all of its answers
    const questionAnswers = {
      question_id: q.question_id,
      question: q.question,
      correct_answer: correctAnswer,
      bad_answers: badAnswers,
    };
    // add the questions questionAnswers in the table that contains all the details of the quiz
    AllquestionsAnswers.push(questionAnswers);
  }
  if (AllquestionsAnswers.length > 0) {
    return AllquestionsAnswers;
  }
  return undefined;
}
module.exports = {
  readAllQuizzesByUser,
  readCategoryByLabel,
  readAllCategories,
  addOneQuiz,
  addQuestionsAnswers,
  deleteOneQuiz,
  readAllQuizzesByCategory,
  readOneQuizDetailsByID,
};
