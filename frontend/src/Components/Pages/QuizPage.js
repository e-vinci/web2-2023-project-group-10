import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import Navigate from '../Router/Navigate';

import { clearPage } from '../../utils/render';
import { readOneQuizById } from '../../models/quizzes';
import { getConnectedUserDetails } from '../../utils/auths';
import { updateUserPoint } from '../../models/users';
import { addOneBadgeToUser, readAllBadgesByUser } from '../../models/badges';
import imageTest from '../../img/checklist_8186431.png';
import { showError } from '../../utils/customAlerts';

let score = 0;
let userID;
let allQuestionsAnswers = [];
let currentQuestion = 0;
let nbQuestion;
let newPoint;
let startTime;
let intervalId;
let timerActivated = false;

function redirect() {
  showError(`Le quiz n'existe pas`);
  Navigate('/categories');
}

const quizPage = async () => {
  clearPage();
  const url = new URLSearchParams(window.location.search);
  const quizId = url.get('id');
  allQuestionsAnswers = await readOneQuizById(quizId);
  if (allQuestionsAnswers === undefined) {
    console.log('erreur');
    return redirect();
  }
  randomTab(allQuestionsAnswers);
  nbQuestion = allQuestionsAnswers.length;
  console.log('The quiz', allQuestionsAnswers);
  renderQuizModal();
  const modal = document.getElementById('quizModal');
  const displayQuizModal = new Modal(modal);
  displayQuizModal.show();
  return null; // // jsp eslint oblige a return a modif
};

function renderQuizModal() {
  clearPage();
  const main = document.querySelector('main');
  main.innerHTML = `
<div class = "modal fade" id="quizModal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
      <img src=${imageTest}>
        <h4 class="modal-title fs-5" id="staticBackdropLabel">Prêt à tester vos connaissances ?</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
      <p>Nombre de questions : ${nbQuestion} </p>
     
      <div class="input-group">
      <p>Souhaites-tu utiliser un chronométre ? </p>
      <div class="form-check form-switch form-check-reverse ">
      <input class="form-check-input" type="checkbox" id="btnChecked">
     </div>

     </div>

     <div id="empty">
     </div>
      </div>

      <div class="modal-footer">
      <button type="button" class="btn btn-style btnStart">Commencer</button>
      </div>
    
      </div>
      </div>
      </div>
  `;

  const checkboxSwitch = document.getElementById('btnChecked');
  const btnStart = document.querySelector('.btnStart');

  const btnClose = document.querySelector('.btn-close');
  btnClose.addEventListener('click', () => {
    Navigate('/categories');
  });

  checkboxSwitch.addEventListener('change', () => {
    console.log('je suis iciii');
    const inputTimer = document.getElementById('empty');

    if (checkboxSwitch.checked === true) {
      timerActivated = true;
      inputTimer.innerHTML += `<div>
      <div class="input-group">
        <input id="timer"
          type="text"
          class="form-control"
          placeholder="Entre le temps en secondes"
          aria-label=""
        />
        <span class="input-group-text" id="basic-addon2">secondes</span>
        

      </div>
              <span id="errorMessage"></span>

      </div>
`;
    } else {
      timerActivated = false;
      inputTimer.innerHTML = '';
    }
  });

  btnStart.addEventListener('click', () => {
    const errMsg = document.getElementById('errorMessage');

    if (checkboxSwitch.checked) {
      timerActivated = true;
      const timerValue = document.getElementById('timer').value;
      console.log('CHRONOOO', timerValue);
      const timerNumber = parseInt(timerValue, 10);
      if (timerNumber <= 0 || Number.isNaN(timerNumber)) {
        errMsg.innerHTML = '*Veuillez entrer une valeur pour configurer le chronométre';
        return;
      }
      errMsg.innerHTML = '';
      startTime = timerNumber;
    }

    renderQuizPage();
  });

  console.log('je suis sorti');
}

async function renderScore() {
  currentQuestion = 0;
  const main = document.querySelector('main');

  main.innerHTML = `
<div class = "modal fade" id="quizModal2" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="staticBackdropLabel">Ton score</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body color-modal-score">
      <h2 class="fs-4 mt-1 card-title text-center"> ${score}/${nbQuestion}</h2>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-style btnRestart">Recommencer</button>
      </div>
      </div>
      </div>
      </div>`;
  const currentUser = await getConnectedUserDetails();
  if (currentUser) {
    userID = currentUser.userID;
    newPoint = await updateUserPoint(score);
    const userBadges = await readAllBadgesByUser(userID);
    console.log('userBadges est', userBadges);

    console.log('userID : ', userID);
    if (
      newPoint >= 200 &&
      newPoint < 400 &&
      !(await badgeIsAlreadyEarned('Médaille de bronze', userBadges))
    ) {
      winABadge('Médaille de bronze');
    } else if (
      newPoint >= 400 &&
      newPoint < 600 &&
      !(await badgeIsAlreadyEarned("Médaille d'argent", userBadges))
    ) {
      winABadge("Médaille d'argent");
    } else if (
      newPoint >= 600 &&
      newPoint < 800 &&
      !(await badgeIsAlreadyEarned("Médaille d'or", userBadges))
    ) {
      winABadge("Médaille d'or");
    } else if (
      newPoint >= 800 &&
      newPoint < 1000 &&
      !(await badgeIsAlreadyEarned('Médaille de platine', userBadges))
    ) {
      winABadge('Médaille de platine');
    } else if (newPoint === 800) {
      winABadge('Médaille de platine'); // à modif
    }
  }
  const restartButton = document.querySelector('.btnRestart');
  score = 0;
  restartButton.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = undefined;
    score = 0;
    currentQuestion = 0;
    startTime = undefined;
    timerActivated = false;
    quizPage();
  });

  const btnClose = document.querySelector('.btn-close');
  btnClose.addEventListener('click', () => {
    Navigate('/categories');
  });
  const modal = document.getElementById('quizModal2');
  const displayQuizModal = new Modal(modal);
  displayQuizModal.show();
}
async function badgeIsAlreadyEarned(label, userBadges) {
  console.log('userbadgezzdzefez', userBadges);
  console.log('userbadge', userBadges);
  if (userBadges.length === 0) return false;
  return userBadges.some((badge) => badge.label === label);
}

async function winABadge(label) {
  await addOneBadgeToUser(userID, label);
  Swal.fire({
    title: `🎉 Bravo ! Tu vient de remporter le badge : ${label} ! 🏅 Va vite le découvrire dans ton espace`,
    width: 600,
    padding: '3em',
    color: '#716add',
    background: '#fff url(/images/trees.png)',
    backdrop: `
      rgba(0,0,123,0.4)
      left top
      no-repeat
    `,
  });
}

function randomTab(tab) {
  const array = tab;
  for (let i = tab.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [tab[j], tab[i]];
  }
}
async function renderQuizPage() {
  clearPage();
  const main = document.querySelector('main');
  const minutes = Math.floor(startTime / 60);
  const seconds = startTime % 60;
  let renderTime = '';
  if (timerActivated) {
    renderTime = `<div class = "container-timer">
                   <div class="display-timer"> ${minutes} ${seconds} </div>
                 </div>`;
  }
  if (currentQuestion === nbQuestion) {
    renderScore();
  } else {
    const currentQuestionAnswers = allQuestionsAnswers[currentQuestion];
    const answers = currentQuestionAnswers.bad_answers;
    const { question } = currentQuestionAnswers;
    const goodAnswer = currentQuestionAnswers.correct_answer;
    answers.push(goodAnswer);
    randomTab(answers);
    let mainQuiz = `
        <section>
        <div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
        <div class="w-75">
            <div class="card shadow-lg">
                <div class="card-body p-5">
                ${renderTime}
                    <div class="alert  text-center">
                        <h2 class="fs-4 mt-1 card-title question">${question}</h2>
                    </div>
                    <div id= "emptyDiv">
                    </div>
                    <form>
                    `;
    answers.forEach((answer) => {
      mainQuiz += `     
  <div class="row mb-3">
  <div class="col">
      <input type="text" class="form-control answer" value="${answer}" readonly >
  </div>
  </div>`;
    });
    mainQuiz += `
                 <div  class="text-center">
                  <p class="text-danger" id="errorMessage"></p>
                  </div>
                        <div class="mb-3 text-center">
                            <button type="button" class="btn btn-primary " id="btnValidate"> Valider </button>
                        </div>
                    </form>
                    <p class="quiz-progress text-end">${currentQuestion + 1}/${nbQuestion}</p>
                </div>
            </div>
        </div>
    </div>
        </section>
        `;

    main.innerHTML = mainQuiz;

    if (timerActivated === true) {
      printTime();
      startChrono();
    }

    let isValidate = false;
    let selectedAnswer = null;
    const errorMessage = document.querySelector('#errorMessage');
    let allAnswers = document.querySelectorAll('.answer');
    allAnswers.forEach((answer) => {
      const a = answer;
      answer.addEventListener('click', () => {
        errorMessage.innerText = '';
        if (!isValidate) {
          allAnswers.forEach((otherAnswer) => {
            const other = otherAnswer;
            other.style.backgroundColor = 'white';
          });
          a.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
          selectedAnswer = answer.value;
          console.log('selectedAnswer : ', selectedAnswer);
        }
      });
    });

    const continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.className = 'btn btn-primary';
    continueButton.id = 'btnContinue';
    continueButton.innerText = 'Continuer';
    const validate = document.getElementById('btnValidate');
    validate.addEventListener('click', () => {
      isValidate = true;
      let selectedAnswerIsFalse = false;
      if (selectedAnswer === null) {
        errorMessage.innerText = 'Merci de sélectionner une réponse';
        isValidate = false;
      } else {
        errorMessage.innerText = '';
        if (selectedAnswer === goodAnswer) {
          selectedAnswerIsFalse = false;
          score += 1;
        } else {
          selectedAnswerIsFalse = true;
        }
        console.log('score : ', score);
        allAnswers = document.querySelectorAll('.answer');
        allAnswers.forEach((currentAnswer) => {
          const answer = currentAnswer;
          if (selectedAnswerIsFalse && currentAnswer.value === selectedAnswer) {
            answer.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
          } else if (currentAnswer.value === goodAnswer) {
            answer.style.backgroundColor = 'rgba(144, 238, 144, 0.7)';
          } else {
            answer.style.backgroundColor = 'white';
          }
        });
        validate.replaceWith(continueButton);
      }
    });

    continueButton.addEventListener('click', () => {
      currentQuestion += 1;
      renderQuizPage();
    });
  }
}

function startChrono() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(printTime, 1000); // 1000 donc tt les sec
}

function printTime() {
  const displaychrono = document.querySelector('.display-timer');
  // a verifier si utilisateur fini avant que timer s'écoule
  if (!displaychrono) {
    clearInterval(intervalId);
    intervalId = undefined;
    return;
  }

  if (startTime >= 60) {
    const minutesTimer = Math.floor(startTime / 60);
    const secondsTimer = startTime % 60;
    displaychrono.innerHTML = `Temps restant : ${minutesTimer} min : ${secondsTimer} sec`;
  } else {
    displaychrono.innerHTML = `Temps restants : 00 min : ${startTime} sec`;
  }

  startTime -= 1;
  if (startTime === 0 && currentQuestion !== nbQuestion) {
    Swal.fire({
      icon: 'warning',
      title: '',
      text: 'Le temps est écoulé',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content',
        confirmButton: 'swal-custom-confirm-button',
      },
      showCancelButton: false,
      confirmButtonText: 'OK',
    });
    renderScore();
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

export default quizPage;
