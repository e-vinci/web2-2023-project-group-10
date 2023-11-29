import anime from 'animejs';
import { clearPage } from '../../utils/render';
// eslint-disable-next-line no-unused-vars
import {fetchQuestionsById, fetchQuestionsByQuizzId} from '../../models/questions';
import fetchAnswersByQuestionId from '../../models/answers';


let selectedAnswer = -1;


const quizPage = async () => {
    // const quizId = 1;
    let questionCursor = 0;
    const chosenAnswers = [];
    const questionIds = [1];

    const currentQuestionId = questionIds[questionCursor];
    const currentQuestion = await fetchQuestionsById(currentQuestionId);
    clearPage();
    renderQuestionLayout();
    const currentAnswers = await fetchAnswersByQuestionId(currentQuestionId);
    insertQuestionData(currentQuestion, currentAnswers, questionCursor+1, questionIds.length);
    updateButtonsText(questionCursor, questionIds.length);

    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', async () => {
        fade();

        chosenAnswers.push(selectedAnswer);

        // Fetch questions for the next card
        questionCursor += 1;
        const nextQuestionId = questionIds[questionCursor];
        const nextQuestion = await fetchQuestionsById(nextQuestionId);

        // Fetch answers for the next question
        const nextAnswers = await  fetchAnswersByQuestionId(nextQuestionId);

        // Update the card content with the next question and answers
        insertQuestionData(nextQuestion, nextAnswers, questionCursor+1, questionIds.length);
        updateButtonsText(questionCursor, questionIds.length);
    });

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', async () => {
        fade();
        chosenAnswers.pop();

        // Fetch questions for the last card
        questionCursor -= 1;
        const lastQuestionId = questionIds[questionCursor];
        const lastQuestion = await fetchQuestionsById(lastQuestionId);

        // Fetch answers for the last question
        const lastAnswers = await  fetchAnswersByQuestionId(lastQuestionId);

        // Update the card content with the last question and answers
        insertQuestionData(lastQuestion, lastAnswers, questionCursor+1, questionIds.length);
        updateButtonsText(questionCursor, questionIds.length);
    });
};

function updateButtonsText(questionCursor, maxLength) {
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const backButton = document.getElementById('backButton');

    if (questionCursor === maxLength) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
    } else {
        nextButton.style.display = 'block';
        submitButton.style.display = 'none';
        }
    if (questionCursor === 0) {
        backButton.style.visibility = 'hidden';
    } else {
        backButton.style.visibility = 'visible';
    }
}

function renderQuestionLayout() {
    const main = document.querySelector('main');
    const container = document.createElement('div');
    container.classList = 'container text-center';
    const row = document.createElement('div');
    row.classList = 'row pt-5';

    // Back Button Column
    const backButtonCol = document.createElement('div');
    backButtonCol.classList = 'col-md-2';
    renderBackButtonLayout(backButtonCol);
    row.appendChild(backButtonCol);

    // Content Column
    const contentCol = document.createElement('div');
    contentCol.classList = 'col-md-8';

    const card = document.createElement('div');
    card.classList = 'card';

    // Header
    const cardHeader = document.createElement('div');
    cardHeader.classList = 'card-header';
    cardHeader.id = 'question-header';
    card.appendChild(cardHeader);

    // Question Content
    const cardBody = document.createElement('div');
    cardBody.classList = 'card-body';
    const questionForm = document.createElement('form');
    questionForm.appendChild(renderTimer());
    questionForm.appendChild(renderAnswerButtons());
    cardBody.appendChild(questionForm);
    card.appendChild(cardBody);

    // Question Number
    const cardFooter = document.createElement('div');
    cardFooter.classList = 'card-footer text-muted';
    const questionNumberHeader = document.createElement('h4');
    questionNumberHeader.id = 'question-number-header';
    cardFooter.appendChild(questionNumberHeader);
    card.appendChild(cardFooter);

    contentCol.appendChild(card);
    row.appendChild(contentCol);

    // Submit Button Column
    const submitButtonCol = document.createElement('div');
    submitButtonCol.classList = 'col-md-2';
    renderNextButtonLayout(submitButtonCol);
    renderSubmitButtonLayout(submitButtonCol);
    row.appendChild(submitButtonCol);

    container.appendChild(row);
    main.appendChild(container);
}

function renderNextButtonLayout(container) {
    const submit = document.createElement('button');
    submit.id = 'nextButton';
    submit.className = 'btn btn-secondary mb-5';
    const span = document.createElement('span');
    span.textContent = 'Next';

    submit.appendChild(span);

    container.appendChild(submit);
}

function renderSubmitButtonLayout(container) {

    const submit = document.createElement('button');
    submit.id = 'submitButton';
    submit.type = 'button';
    submit.className = 'btn btn-secondary';
    submit.style.display = 'none';
    const span = document.createElement('span');
    span.textContent = 'Submit';

    submit.addEventListener('click', () => {
        alert('Quiz results will be displayed here.'); // Temporary alert for demonstration
    });

    submit.appendChild(span);
    container.appendChild(submit);
}

function renderBackButtonLayout(container) {
    const backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.className = 'btn btn-secondary mb-5';
    const span = document.createElement('span');
    span.textContent = 'Back';

    backButton.appendChild(span);

    container.appendChild(backButton);
}

function renderAnswerButtons() {
    const labels = [];
    const container = document.createElement('div');

    for (let index = 1; index < 5; index += 1) {
        const answerRadioId = `${index}`;

        const answerItem = document.createElement('div');
        const answerContent = document.createElement('label');
        answerContent.setAttribute('for', answerRadioId);
        answerContent.classList += 'answer-label';

        const answerRadio = document.createElement('input');
        answerRadio.type = 'radio';
        answerRadio.id = answerRadioId;
        answerRadio.style.display = 'none';
        answerRadio.name = 'answers';

        // eslint-disable-next-line no-loop-func
        answerRadio.onclick = () => {
            for (let j = 0; j < labels.length; j += 1) {
                const element = labels[j];
                element.style.backgroundColor = 'white';
            }
            answerContent.style.backgroundColor = '#6f52f9';
            selectedAnswer = answerRadioId;
        };
        labels.push(answerContent);

        answerItem.appendChild(answerContent);
        answerItem.appendChild(answerRadio);
        container.appendChild(answerItem);
}

    return container;
}

function renderTimer() {
    const timerContainer = document.createElement('div');
    timerContainer.classList = 'd-flex justify-content-end';

    const timerText = document.createElement('h4');
    let count = 60;
    const updateTimerText = () => {
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerText.innerText = `Temps restant : ${formattedTime}`;
    };

    updateTimerText();

    const timer = setInterval(() => {
        count -= 1;
        if (count === 0) {
            clearInterval(timer);
            timerText.innerText = "Temps écoulé!";
        } else {
            updateTimerText();
        }
    }, 1000);

    timerContainer.appendChild(timerText);
    return timerContainer;
}

function insertQuestionData(question, answers, questionNumber, numberOfQuestions) {
    const questionHeader = document.getElementById('question-header');
    questionHeader.innerText = question.libelle;

    const answerLabels = document.querySelectorAll('label');
    answerLabels.forEach((label, index) => {
        // eslint-disable-next-line no-param-reassign
        label.innerText = answers[index].libelle
    });

    // Modify the question number
    const questionNumberHeader = document.getElementById('question-number-header');
    questionNumberHeader.innerText = `Question n°${questionNumber}/${numberOfQuestions}`;
}

function fade() {
    anime({
        targets: document.querySelector('.card'),
        opacity: 0,
        duration: 1, // Adjust the duration for a slower fade in
        easing: 'easeOutQuad',
        complete: () => {
            // Start the fade out animation after the fade in is complete
            anime({
                targets: document.querySelector('.card'),
                opacity: 1,
                duration: 300, // Adjust the duration for a slower fade out
                easing: 'easeInQuad',
            });
        },
    });
}

export default quizPage;
