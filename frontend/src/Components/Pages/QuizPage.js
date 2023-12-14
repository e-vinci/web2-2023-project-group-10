/* eslint-disable camelcase */
/* eslint-disable import/named */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
import navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { readOneQuizById } from '../../models/quizzes';
import getConnectedUserDetails from '../../utils/auths';
import { updateUserPoint } from '../../models/users';
import { addOneBadgeToUser } from '../../models/badges';

let score = 0;
let user_id;
let allQuestionsAnswers = [];
let currentQuestion = 0;
let nbQuestion;
let newPoint;
let userID;

const quizPage = async () => {
  clearPage();
  const url = new URLSearchParams(window.location.search);
  const quizId = url.get('id');
  allQuestionsAnswers = await readOneQuizById(quizId);
  randomTab(allQuestionsAnswers);
  nbQuestion = allQuestionsAnswers.length;
  console.log('The quiz', allQuestionsAnswers);
  renderQuizPage();
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
    user_id = currentUser.userID;
    newPoint = await updateUserPoint(user_id, score);

    console.log('userIDDDDD', user_id);
    // Modifier les conditions
    if (newPoint > 200 && newPoint < 400) {
      winABadge('Médaille de bronze');
    } else if (newPoint > 400 && newPoint < 600) {
      winABadge("Médaille d'argent");
    } else if (newPoint > 600 && newPoint < 800) {
      winABadge("Médaille d'or");
    } else if (newPoint > 800 && newPoint < 1000) {
      winABadge('medal');
    } else if (newPoint > 1000) {
      winABadge('');
    }
  }
}

async function winABadge(label) {
  await addOneBadgeToUser(userID, label);
}

function randomTab(tab) {
  for (let i = tab.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tab[i], tab[j]] = [tab[j], tab[i]];
  }
}
async function renderQuizPage() {
  clearPage();
  const main = document.querySelector('main');
  if (currentQuestion === nbQuestion) {
    renderScore();
  } else {
    let currentQuestionAnswers = allQuestionsAnswers[currentQuestion];
    let answers = currentQuestionAnswers.bad_answers;
    let question = currentQuestionAnswers.question;
    let goodAnswer = currentQuestionAnswers.correct_answer;
    answers.push(goodAnswer);
    randomTab(answers);
    let mainQuiz = `
        <section>
        <div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
        <div class="w-75">
            <div class="card shadow-lg">
                <div class="card-body p-5">
                    <div class="alert  text-center">
                        <h2 class="fs-4 mt-1 card-title">${question}</h2>
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
    let answersDisplay = document.querySelectorAll('.answer');
    answersDisplay.forEach((answer) => {
      answer.addEventListener('click', () => {
        errorMessage.innerText = '';
        if (!isValidate) {
          answersDisplay.forEach((otherAnswer) => {
            otherAnswer.style.backgroundColor = 'white';
          });
          answer.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
          selectedAnswer = answer.value;
          console.log('selectedAnswer : ', selectedAnswer);
        }
      });
    });

    let continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.className = 'btn btn-primary';
    continueButton.id = 'btnContinue';
    continueButton.innerText = 'Continuer';
    let validate = document.getElementById('btnValidate');
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
          score++;
        } else {
          selectedAnswerIsFalse = true;
        }
        console.log('score : ', score);
        answersDisplay = document.querySelectorAll('.answer');
        answersDisplay.forEach((answer) => {
          if (selectedAnswerIsFalse && answer.value === selectedAnswer) {
            answer.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
          } else if (answer.value === goodAnswer) {
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
