const fetchAnswersByQuestionId = async (questionId) => {
    try {
        const response = await fetch(`http://localhost:3000/answers/${questionId}`);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }
        const answers = await response.json();
        console.log('ANSWERS : ', answers)
        return answers;
    } catch (error) {
        console.error('Error fetching answers:', error);
        throw error;
    }
};

export default fetchAnswersByQuestionId;
