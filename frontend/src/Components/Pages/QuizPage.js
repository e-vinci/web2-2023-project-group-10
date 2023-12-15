import Swal from 'sweetalert2';
import Navigate from '../Router/Navigate';

import { clearPage } from '../../utils/render';
import { readOneQuizById } from '../../models/quizzes';
import { getConnectedUserDetails } from '../../utils/auths';
import { updateUserPoint } from '../../models/users';
import { addOneBadgeToUser } from '../../models/badges';

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

    console.log('userID', userID);
    // Modifier les conditions
    if (newPoint === 16) {
      winABadge('Médaille de bronze');
    } else if (newPoint === 200) {
      winABadge("Médaille d'argent");
    } else if (newPoint === 400) {
      winABadge("Médaille d'or");
    } else if (newPoint === 600) {
      winABadge('medal');
    } else if (newPoint === 800) {
      winABadge('Médaille de platine');
    }
  }
  score = 0; // à changer par fenetre de fin de jeu
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

function randomTab(tab) { // ici
  const array = tab;
  for (let i = tab.length - 1; i > 0; i-=1) {
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
    const {question} = currentQuestionAnswers;
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
    let answersDisplay = document.querySelectorAll('.answer');
    answersDisplay.forEach((answer) => {
      const a = answer;
      answer.addEventListener('click', () => {
        errorMessage.innerText = '';
        if (!isValidate) {
          answersDisplay.forEach((otherAnswer) => {
            const other = otherAnswer; // ici
            other.style.backgroundColor = 'white';
          });
          a.style.backgroundColor = 'rgba(200, 200, 200, 0.7)'; // ici
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
          score+=1;
        } else {
          selectedAnswerIsFalse = true;
        }
        console.log('score : ', score);
        answersDisplay = document.querySelectorAll('.answer');
        answersDisplay.forEach((answer) => {
          const a = answer;
          if (selectedAnswerIsFalse && answer.value === selectedAnswer) {
            a.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
          } else if (answer.value === goodAnswer) {
            a.style.backgroundColor = 'rgba(144, 238, 144, 0.7)';
          } else {
            a.style.backgroundColor = 'white';
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
