import { clearPage } from '../../utils/render';
import Questions from '../../models/questions'
import Answers from '../../models/answers';

let selectedAnswer = -1;


const quizPage = async () => {
    const quizId = 1;
    const chosenAnswers = [];
    const questionModel = new Questions(quizId);
    await questionModel.fetchQuestions();
    clearPage();
    renderQuestionLayout();
    const currentQuestion = questionModel.getCurrentQuestion();
    const answerModel = new Answers(currentQuestion.id_question);
    await answerModel.fetchAnswers();
    insertQuestionData(questionModel, answerModel);
    updateButtonsText(questionModel);

    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', async () => {
        chosenAnswers.push(selectedAnswer);
        questionModel.goToNextQuestion();
        
        // Fetch answers for the next question
        const nextAnswerModel = new Answers(questionModel.getCurrentQuestionNumber());
        await nextAnswerModel.fetchAnswers();

        // Update the card content with the next question and answers
        insertQuestionData(questionModel, nextAnswerModel);
        updateButtonsText(questionModel);
        if (questionModel.isLastQuestion()) {
            console.log('REDIRECT TO RESULT PAGE')
            console.log(chosenAnswers)
        }
    });

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        chosenAnswers.pop();
        questionModel.goToPreviousQuestion();
        insertQuestionData(questionModel, answerModel);
        updateButtonsText(questionModel);
    });
};

function updateButtonsText(questionModel) {
    const nextButton = document.getElementById('nextButton');
    const backButton = document.getElementById('backButton');

    // Access the span inside each button
    const nextButtonSpan = nextButton.querySelector('span');
    const backButtonSpan = backButton.querySelector('span');

    nextButtonSpan.textContent = questionModel.isLastQuestion() ? 'Submit' : 'Next';
    if (questionModel.isFirstQuestion()) {
        backButton.style.visibility = 'hidden';
    } else {
        backButton.style.visibility = 'visible';
        backButtonSpan.textContent = 'Back';
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
    questionForm.style.backgroundColor = '#4472C4';
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
    row.appendChild(submitButtonCol);

    container.appendChild(row);
    main.appendChild(container);
}

function renderNextButtonLayout(container) {
    const submit = document.createElement('button'); // Change from input to button
    submit.id = 'nextButton';
    submit.className = 'btn btn-secondary mb-5';

    // Create a span element
    const span = document.createElement('span');
    span.textContent = 'Next';

    // Append the span inside the button
    submit.appendChild(span);

    container.appendChild(submit);
}

function renderBackButtonLayout(container) {
    const backButton = document.createElement('button'); // Change from input to button
    backButton.id = 'backButton';
    backButton.className = 'btn btn-secondary mb-5';

    // Create a span element
    const span = document.createElement('span');
    span.textContent = 'Back';

    // Append the span inside the button
    backButton.appendChild(span);

    container.appendChild(backButton);
}

function renderAnswerButtons() {
    const labels = [];
    const container = document.createElement('div');
    container.style.textAlign = 'center';

    for (let index = 1; index < 5; index += 1) {
        const answerRadioId = `${index}`;

        const answerItem = document.createElement('div');
        const answerContent = document.createElement('label');
        answerContent.setAttribute('for', answerRadioId);
        answerContent.style.margin = '10px';
        answerContent.style.borderRadius = '5px';
        answerContent.style.backgroundColor = 'white';
        answerContent.style.width = '75%';

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
            answerContent.style.backgroundColor = 'green';
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
    timerText.style.padding = "10px";
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

function insertQuestionData(question, answers) {
    const questionHeader = document.getElementById('question-header');
    questionHeader.innerText = question.getCurrentQuestion().libelle;

    const answerLabels = document.querySelectorAll('label');
    answerLabels.forEach((label, index) => {
        // eslint-disable-next-line no-param-reassign
        label.innerText = answers.getAnswerContent(index);
    });

    // Modify the question number
    const questionNumberHeader = document.getElementById('question-number-header');
    questionNumberHeader.innerText = `Question n°${question.getCurrentQuestionNumber()}/${question.getCurrentQuizNumberOfQuestions()}`;
}
export default quizPage;
