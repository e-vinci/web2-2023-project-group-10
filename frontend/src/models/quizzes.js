/* eslint-disable no-undef */
/* eslint-disable no-console */
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Création du quiz réussie!',
      text: 'Votre quiz a été créé avec succès.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
    return createdQuiz;
  } catch (err) {
    loadingSpinner.style.display = 'none';
    Swal.fire({
      // nécessaire ??
      title: 'Erreur lors de la création du quiz',
      text: err.message,
      icon: 'error',
    });
    console.error('addOneQuiz::error: ', err);
    throw err;
  }
};

const readAllQuizzesByUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/quizzes/?user-id=${id}`);
    if (!response.ok) {
      if (response.status === 400) {
        return [];
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const quizzes = await response.json();
    console.log('Categories :', quizzes);
    return quizzes;
  } catch (err) {
    console.error('readAllQuizzesByUser::error: ', err);
    throw err;
  }
};

const deleteOneQuiz = async (quiz) => {
  console.log('I am in models/quizzes.js, in the function deleteOneQuiz');
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
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(options);
    const response = await fetch(`http://localhost:3000/quizzes/${quiz}`, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    loadingSpinner.style.display = 'none';
    const deletedQuiz = await response.json();
    console.log('deletedQuiz :', deletedQuiz);

    return response;
  } catch (err) {
    loadingSpinner.style.display = 'none';
    console.error('deleteOneQuiz::error: ', err);
    throw err;
  }
};


const readAllQuizzesByCategory = async (categoryName) => {
  try {
    console.log('url :', `http://localhost:3000/quizzes/?label=${categoryName}`);
    const response = await fetch(`http://localhost:3000/quizzes/?label=${categoryName}`);

    console.log('response',response)
    if (!response.ok) {
      if(response.status === 400) {
        console.log("je suis dans la verification");
        return [];
      }
      console.error(`Erreur HTTP: ${response.status}`);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const quizzesInCategory = await response.json();
    console.log('Quizzes de la catégorie:', quizzesInCategory);
    return quizzesInCategory;
  } catch (err) {
    console.error('readAllQuizzesByCategory::error:', err);
    throw err;
  }

};

export { readAllCategories, addOneQuiz, readAllQuizzesByUser, deleteOneQuiz, readAllQuizzesByCategory };
