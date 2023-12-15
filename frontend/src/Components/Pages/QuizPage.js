import Swal from 'sweetalert2';
import Navigate from '../Router/Navigate';

import { clearPage } from '../../utils/render';
import { readOneQuizById } from '../../models/quizzes';
import { getConnectedUserDetails } from '../../utils/auths';
import { updateUserPoint } from '../../models/users';
import { addOneBadgeToUser, readAllBadgesByUser } from '../../models/badges';

let score = 0;
let userID;
let allQuestionsAnswers = [];
let currentQuestion = 0;
let nbQuestion;
let newPoint;

function showError() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `Le quiz n'existe pas`,
  });
  Navigate('/categories');
}
const quizPage = async () => {
  clearPage();
  const url = new URLSearchParams(window.location.search);
  const quizId = url.get('id');
  allQuestionsAnswers = await readOneQuizById(quizId);
  if (allQuestionsAnswers === undefined) {
    console.log('erreur');
    return showError();
  }
  randomTab(allQuestionsAnswers);
  nbQuestion = allQuestionsAnswers.length;
  console.log('The quiz', allQuestionsAnswers);
  return renderQuizPage();
};

async function renderScore() {
  currentQuestion = 0;
  const main = document.querySelector('main');
  let result = '';
  if (score <= nbQuestion / 2) {
    result = 'Ne lâche rien, persévère !';
  } else if (score > nbQuestion * 0.75) {
    result = 'Bravo ! Tes efforts paient, continue sur cette lancée !';
  } else {
    result = "Waooow, tu t'es surpassé !";
  }
  main.innerHTML = `
  <section>
  <div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
  <div class="w-75">
      <div class="card shadow-lg">
          <div class="card-body p-5">
              <div class="alert  text-center">
                  <h2 class="fs-4 mt-1 card-title"> Tu as obtenu ${score} ${
    score === 1 ? 'bonne réponse' : 'bonnes réponses'
  }</h2>
                  <h2 class="fs-4 mt-1 card-title">${result}</h2>
              </div>
              </div>
              </div>
          </div>
      </div>
          </section>`;

  const currentUser = await getConnectedUserDetails();

  if (currentUser) {
    userID = currentUser.userID;
    newPoint = await updateUserPoint(userID, score);
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
  score = 0; // à changer par fenetre de fin de jeu
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
                    <div class="alert  text-center">
                        <h2 class="fs-4 mt-1 card-title question">${question}</h2>
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

export default quizPage;
