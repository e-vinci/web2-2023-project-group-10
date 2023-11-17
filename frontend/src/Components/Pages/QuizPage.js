import Navigate from '../Router/Navigate';
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
    row.classList = 'row align-items-center justify-content-end pt-5';

    const contentCol = document.createElement('div');
    contentCol.classList = 'col-md-9';
    const nextButtonCol = document.createElement('div');
    nextButtonCol.classList = 'col-md-2';

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

    // Question Number
    const questionNumberHeader = document.createElement('h4');
    questionNumberHeader.innerText = "Question n°X/Z";
    questionNumberHeader.style.border = '1px solid black';
    questionNumberHeader.style.padding = '10px';
    questionNumberHeader.style.backgroundColor = 'white';
    questionNumberHeader.style.marginLeft = '50px';
    questionNumberHeader.style.marginRight = '50px';


    renderNextButtonLayout(nextButtonCol);

    contentCol.appendChild(header);
    contentCol.appendChild(questionForm);
    contentCol.appendChild(questionNumberHeader);
    row.appendChild(contentCol);
    row.appendChild(nextButtonCol);
    container.appendChild(row);
    main.appendChild(container);
}

function renderNextButtonLayout(container) {
    const submit = document.createElement('input');
    submit.value = 'Next';
    submit.className = 'btn btn-secondary mb-5';
    submit.addEventListener('click', () => {
        // Modify navigate according to db values
        Navigate('/');
    });
    container.appendChild(submit);
}

function renderAnswerButtons() {
    const labels = [];
    const liste = document.createElement('ul');
    liste.style.listStyleType = 'none';
    liste.style.textAlign = 'center';
    for (let index = 1; index < 5; index += 1) {
        const answerRadioId = `answer${index}`;

        const answerItem = document.createElement('li');
        const answerContent = document.createElement('label');
        answerContent.innerText = `Answer Sample ${index}`;
        answerContent.setAttribute('for', answerRadioId);
        answerContent.style.margin = '10px';
        answerContent.style.padding = '10px';
        answerContent.style.borderRadius = '10px';
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
        liste.appendChild(answerItem);
    }
    return liste;
}

function renderTimer() {
    const timerText = document.createElement('h4');
    timerText.style.paddingTop = '0px';
    timerText.innerText = "Temps restant : 15"
    let count = 14;
    const timer = setInterval(() => {
        timerText.innerText = `Temps restant : ${count}`;
        count-=1;
        if (count === 0) {
            clearInterval(timer);
            timerText.innerText = "Temps écoulé!"
        }
        }, 1000);
    return timerText;
}

export default NewPage;
