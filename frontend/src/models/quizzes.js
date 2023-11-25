/* eslint-disable no-console */
const readAllCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/quizzes/categories');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      // const result = await response.json();
      const categories = await response.json();
      console.log('Categories :', categories);
      return categories;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const addOneQuiz = async (quiz) => {
  };
  
  // eslint-disable-next-line import/prefer-default-export
  export { readAllCategories, addOneQuiz };

  