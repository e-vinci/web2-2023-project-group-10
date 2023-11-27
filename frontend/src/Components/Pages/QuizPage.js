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
    nextButton.addEventListener('click', () => {
        chosenAnswers.push(selectedAnswer);
        questionModel.goToNextQuestion();
        insertQuestionData(questionModel, answerModel);
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
    row.classList = 'row align-items-center justify-content-between pt-5';

    const contentCol = document.createElement('div');
    contentCol.classList = 'col-md-6 mx-auto';
    const nextButtonCol = document.createElement('div');
    nextButtonCol.classList = 'col-md-2';

    const backButtonCol = document.createElement('div');
    backButtonCol.classList = 'col-md-2';

    // Header   
    const header = document.createElement('h2');
    header.id = 'question-header';
    header.style.border = '1px solid black';
    header.style.padding = '10px';
    header.style.backgroundColor = 'white';
    header.style.marginBottom = '0px';

    // Question Content
    const questionForm = document.createElement('form');
    questionForm.style.backgroundColor = '#4472C4';
    questionForm.appendChild(renderTimer());
    questionForm.appendChild(renderAnswerButtons());
    questionForm.style.paddingBottom = '20px';

    // Question Number
    const questionNumberHeader = document.createElement('h4');
    questionNumberHeader.id = 'question-number-header';
    questionNumberHeader.style.border = '1px solid black';
    questionNumberHeader.style.backgroundColor = 'white';
    questionNumberHeader.style.marginLeft = '100px';
    questionNumberHeader.style.marginRight = '100px';
    questionNumberHeader.style.marginTop = '20px';


    renderNextButtonLayout(nextButtonCol);
    renderBackButtonLayout(backButtonCol);

    contentCol.appendChild(header);
    contentCol.appendChild(questionForm);
    contentCol.appendChild(questionNumberHeader);

    row.appendChild(backButtonCol);
    row.appendChild(contentCol);
    row.appendChild(nextButtonCol);

    container.appendChild(row);
    main.appendChild(container)
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
    console.log('Current Question : ', question);
    console.log('Current Answers : ', answers);
    // Modify the question header
    const questionHeader = document.getElementById('question-header');
    questionHeader.innerText = question.getCurrentQuestion().libelle;

    // Modify the answer buttons
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
