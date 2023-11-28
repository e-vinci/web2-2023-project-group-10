class answers {
constructor(questionId) {
this.questionId = questionId;
this.answers = [];
// Add other properties you may need
}

    async fetchAnswers() {
    try {
        const response = await fetch(`http://localhost:3000/answers/${this.questionId}`);
        if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }
        this.answers = await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
    }

    getAnswers() {
    return this.answers.rows;
    }

    getAnswerContent(answerId) {
        return this.answers.rows[answerId].libelle;
    }

    getAnswerIsRight(answerId) {
        return this.answers.rows[answerId].est_correcte;
    }
};

export default answers;
