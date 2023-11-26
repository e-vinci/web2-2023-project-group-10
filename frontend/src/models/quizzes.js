/* eslint-disable no-console */
const readAllCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/quizzes/categories');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const categories = await response.json();
    console.log('Categories :', categories);
    return categories;
  } catch (err) {
    console.error('readAllCategories::error: ', err);
    throw err;
  }
};

const addOneQuiz = async (quiz) => {
  console.log('I am in models/quizzes.js, in the function addOneQuiz');
  console.log('param quiz : ', quiz);

  const main = document.querySelector('main');
  main.innerHTML = `
  <div class="text-center" id="loadingSpinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;
  const loadingSpinner = document.querySelector('#loadingSpinner');
  try {
    loadingSpinner.style.display = 'block';
    const options = {
      method: 'POST',
      body: JSON.stringify(quiz),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch('http://localhost:3000/quizzes', options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    loadingSpinner.style.display = 'none';
    const createdQuiz = await response.json();
    console.log('createdQuiz :', createdQuiz);
    return createdQuiz;
  } catch (err) {
    loadingSpinner.style.display = 'none';
    console.error('addOneQuiz::error: ', err);
    throw err;
  }
};

export { readAllCategories, addOneQuiz };
