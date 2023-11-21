import { clearPage } from '../../utils/render';

const NewPage = () => {
    clearPage();
    renderQuestionLayout();
};

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
    header.innerText = "Question Sample";
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
    questionNumberHeader.innerText = "Question n°X/Z";
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
    const submit = document.createElement('input');
    submit.value = 'Next';
    submit.className = 'btn btn-secondary mb-5';
    submit.addEventListener('click', () => {
        // TODO Implement the functionality to go next
    });
    // TODO Change text to Submit if it's the last question
    container.appendChild(submit);
}

function renderBackButtonLayout(container) {
    const backButton = document.createElement('input');
    backButton.value = 'Back';
    backButton.className = 'btn btn-secondary mb-5';
    backButton.addEventListener('click', () => {
        // TODO Implement the functionality to go back
    });
    // TODO Implement functionality to stay hidden if it's the first question
    container.appendChild(backButton);
}

function renderAnswerButtons() {
    const labels = [];
    const container = document.createElement('div');
    container.style.textAlign = 'center';

    for (let index = 1; index < 5; index += 1) {
        const answerRadioId = `answer${index}`;

        const answerItem = document.createElement('div');
        const answerContent = document.createElement('label');
        answerContent.innerText = `Answer Sample ${index}`;
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

        answerRadio.onclick = () => {
            for (let j = 0; j < labels.length; j += 1) {
                const element = labels[j];
                element.style.backgroundColor = 'white';
            }
            answerContent.style.backgroundColor = 'green';
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


export default NewPage;
