const fetchQuestionsById = async (questionId) => {
    try {
        const response = await fetch(`http://localhost:3000/questions/${questionId}`);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }
        const question = await response.json();
        console.log('QUESTION : ', question)
        return question;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

const fetchQuestionsByQuizzId = async (quizId) => {
    try {
        const response = await fetch(`http://localhost:3000/questions/quiz/${quizId}`);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }
        const question = await response.json();
        console.log('QUESTIONS : ', question)
        return question;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

export {fetchQuestionsById, fetchQuestionsByQuizzId};
