class questions {
constructor(quizId) {
this.quizId = quizId;
this.currentQuestionIndex = 0;
this.questions = [];
}

    async fetchQuestions() {
    try {
        const response = await fetch(`http://localhost:3000/questions/${this.quizId}`);
        if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }
        this.questions = await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
    }

    getCurrentQuestion() {
    return this.questions.rows[this.currentQuestionIndex];
    }

    getCurrentQuestionNumber() {
        return this.currentQuestionIndex + 1;
    }

    getCurrentQuizNumberOfQuestions() {
        return this.questions.rows.length;
    }

    goToNextQuestion() {
        if (this.currentQuestionIndex < this.questions.rows.length - 1) {
            this.currentQuestionIndex += 1;
        }
    }

    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex -= 1;
        }
    }

    isLastQuestion() {
    return this.currentQuestionIndex === this.questions.rows.length-1;
    }

    isFirstQuestion() {
    return this.currentQuestionIndex === 0;
    }

// Add more methods as needed
}

export default questions;
