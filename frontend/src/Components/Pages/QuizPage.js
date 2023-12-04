import anime from 'animejs';
import navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
// eslint-disable-next-line no-unused-vars
import {fetchQuestionsById, fetchQuestionsByQuizzId} from '../../models/questions';
import {fetchAnswersByQuestionId, isGivenAnswerCorrect} from '../../models/answers';


let selectedAnswer = -1;
const chosenAnswers = [];

const quizPage = async () => {
    clearPage();
    renderModal();
    const url = new URLSearchParams(window.location.search);
    const quizId = url.get('id');
    let questionCursor = 0;
    const questionIds = await fetchQuestionsByQuizzId(quizId);
    const currentQuestionId = questionIds[questionCursor].question_id;
    const currentQuestion = await fetchQuestionsById(currentQuestionId);
    renderQuestionLayout();
    const currentAnswers = await fetchAnswersByQuestionId(currentQuestionId);
    insertQuestionData(currentQuestion, currentAnswers, questionCursor+1, questionIds.length);
    updateButtonsText(questionCursor, questionIds.length);

    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', async () => {
        fade();
        resetSelectionColors();

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
        resetSelectionColors();
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

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', async () => {
        signalEndOfQuiz(selectedAnswer);
    })
};

function renderModal() {
    const main = document.querySelector('main');
    const modal = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Here will be displayed your results</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <p id="score-p"> Score : </p>
            Some notes will be added here. Maybe add a badge you won
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modalPlayAnotherQuiz" data-bs-dismiss="modal">Play another Quiz</button>
            <button type="button" class="btn btn-primary" id="modalReplayBtn" data-bs-dismiss="modal">Try Again</button>
            <button type="button" class="btn btn-primary" id="modalSubmitButton" data-bs-dismiss="modal">Go Home</button>
        </div>
        </div>
    </div>
    </div>`;
    main.innerHTML += modal;
    const btn1 = document.getElementById('modalSubmitButton');
    btn1.addEventListener('click', () => {
        navigate("/");
    });
    const btn2 = document.getElementById('modalReplayBtn');
    btn2.addEventListener('click', () => {
        quizPage();
    });
    const btn3 = document.getElementById('modalPlayAnotherQuiz');
    btn3.addEventListener('click', () => {
        quizPage();
    });
}

async function signalEndOfQuiz(answer) {
    let score;
    
    if (chosenAnswers.length === 0) {
        console.log('PASSED');
        score = 0;
    } else {
        chosenAnswers.push(answer);
        score = await calculateScore(answer);
    }
    
    updateScore(score);
}


async function calculateScore(answers) {
    let score = 0;
    
    if (chosenAnswers.length === 0) {
        score = 0;
    } else {
        const promises = answers.map(async answer => {
            const isTrue = await isGivenAnswerCorrect(answer);
            if (isTrue.rows[0].is_correct) {
                score += 1;
            }
        });

        await Promise.all(promises);
    }


    return score;
}

function updateScore(score) {
    const scoreP = document.getElementById('score-p');
    scoreP.innerText += score;
}

function resetSelectionColors() {
    const answerLabels = document.querySelectorAll('label');
    answerLabels.forEach((label) => {
        // eslint-disable-next-line no-param-reassign
        label.style.backgroundColor = 'white';
    });
}

function updateButtonsText(questionCursor, maxLength) {
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const backButton = document.getElementById('backButton');

    if (questionCursor+1 === maxLength) {
        nextButton.style.display = 'none';
        submitButton.classList = 'btn btn-secondary';
    } else {
        nextButton.style.display = 'block';
        submitButton.classList = 'btn btn-secondary visually-hidden'
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
    submit.setAttribute("type", "button");
    submit.setAttribute("class", "btn btn-secondary visually-hidden");
    submit.setAttribute("data-bs-toggle", "modal");
    submit.setAttribute("data-bs-target", "#exampleModal");
    submit.setAttribute("id", "submitButton");
    const span = document.createElement('span');
    span.textContent = 'Submit';

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
        answerRadio.addEventListener('click', () => {
            // Check if the radio button is checked
            if (answerRadio.checked) {
                // Get the value or any other property you need
                answerRadio.selectedValue = answerRadio.id;
                
                // Now you can use the selectedValue as needed
                console.log('Selected radio value:', answerRadio.selectedValue);
            }
            });

        // eslint-disable-next-line no-loop-func
        answerRadio.onclick = () => {
            for (let j = 0; j < labels.length; j += 1) {
                const element = labels[j];
                element.style.backgroundColor = 'white';
            }
            answerContent.style.backgroundColor = '#6f52f9';
            selectedAnswer = answerRadio.id;
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
            signalEndOfQuiz(selectedAnswer);
        } else {
            updateTimerText();
        }
    }, 1000);

    timerContainer.appendChild(timerText);
    return timerContainer;
}

function insertQuestionData(question, answers, questionNumber, numberOfQuestions) {
    const questionHeader = document.getElementById('question-header');
    questionHeader.innerText = question.question;

    const answerLabels = document.querySelectorAll('label');
    answerLabels.forEach((label, index) => {
        // eslint-disable-next-line no-param-reassign
        label.innerText = answers[index].answer;
        // eslint-disable-next-line no-param-reassign
        label.setAttribute("for", answers[index].id_answer);
    });
    const answerRadios = document.querySelectorAll('input');
    answerRadios.forEach((radio, index) => {
        // eslint-disable-next-line no-param-reassign
        radio.id = answers[index].id_answer;
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
