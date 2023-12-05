/* eslint-disable no-restricted-syntax */
/* eslint-disable no-const-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import Swal from 'sweetalert2';

import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import getConnectedUserDetails from '../../utils/auths';
import { readAllCategories, addOneQuiz } from '../../models/quizzes';

let questions = [];
let questionCount = 0;
let currentCount = 0;
let numberOfQuestions = 0;
const numberBadAnswer = 3;
let title;
let category;
let quizToBeCreated;
let userID;
const main = document.querySelector('main');

const CreateQuizPage = async () => {
  clearPage();
  const currentUser = await getConnectedUserDetails();
  userID = currentUser.userID;
  questions = [];
  numberOfQuestions = 0;
  questionCount = 0;
  currentCount = 0;
  await renderFormInfoQuiz(); 
  attachEventListenersFromInfoQuiz();
};

function showInfo(message) {
  Swal.fire({
    icon: 'info',
    title: 'Information',
    text: message,
  });
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
}

async function renderFormInfoQuiz() {
  clearPage();
  const allCategories = await readAllCategories();
  let MainFormInfoQuiz = ` 
  <section >
	<div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
		<div class="w-75">
			<div class="card shadow-lg">
				<div class="card-body p-5">
					<div class="alert  text-center">
						<h2 class="fs-4 mt-1 card-title">Créer ton quiz</h2>
					</div>
					<form>
						<div class="row mb-3">
							<div class="col">
								<label class="mb-2 text-muted" for="titleQuiz">Titre</label>
								<input type="text" class="form-control" id="titleQuiz" name="titleQuiz" required autofocus >
							</div>
						</div>
						<div class="row mb-3">
							<div class="col">
								<label class="mb-2 text-muted" for="category">Catégorie</label>
								<select class="form-select" id="category" name="category" required autofocus>
                <option value="" disabled selected>Veuillez sélectionner une catégorie</option>`;
  allCategories.forEach((c) => {
    MainFormInfoQuiz += ` <option value="${c.label}">${c.label}</option>`;
  });

  MainFormInfoQuiz += `
								</select>
							</div>
						</div>
						<div class="row mb-3">
							<label class=" form-label mb-2 text-muted" for="numberQuestion">Nombre de questions</label>
							<div class="col-5 d-flex align-items-center input-group">
								<input type="number" class="form-control" id="numberQuestion" name="numberQuestion" required autofocus >
								<button id="btnInfo" class="btn btn-outline-secondary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Information">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
								</button>
							</div>
						</div>
						<div class="mb-3 text-center">
							<button type="submit" class="btn btn-primary " id="btnSubmitNumber">Continuer</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>`;
  main.innerHTML = MainFormInfoQuiz;
  questionCount++;
  currentCount++;
}

function attachEventListenersFromInfoQuiz() {
  const btnSubmitNumber = document.querySelector('#btnSubmitNumber');
  const btnInfo = document.querySelector('#btnInfo');
  title = document.querySelector('#titleQuiz');
  category = document.querySelector('#category');
  btnInfo.addEventListener('click', (e) => {
    e.preventDefault();
    showInfo('Le nombre maximum de question autorisé est de 70');
  });

  btnSubmitNumber.addEventListener('click', (e) => {
    e.preventDefault();
    numberOfQuestions = parseInt(document.querySelector('#numberQuestion').value, 10);
    console.log(numberOfQuestions);
    console.log('titre', title.value);
    if (!isNaN(numberOfQuestions) && numberOfQuestions > 0 && title.value && category.value)
      renderQuizQuestions();
    else showError('Tous les champs du formulaire sont obligatoires');
  });
}

function renderQuizQuestions() {
  clearPage();
  let quizHTML = `
  <section id="MainQuiz">
    <div class="container-xxl justify-content-center pt-5">
      <div class="card shadow-lg">
        <div class="card-body p-5">
        <h2 class="fs-4 card-title text-center mb-4">Question ${questionCount}</h2>
       <!-- <h2 class="fs-4 fw-bold mb-4 text-end">${title.value}</h2> -->
         
          <form>
            <div class="row mb-3">
              <div class="col">
                <label class="mb-2 text-muted" for="question">Question</label>
                <input type="text" class="form-control" id="question" name="question" value="${
                  questions[questionCount - 1] !== undefined ? questions[questionCount - 1][0] : ''
                }" required autofocus>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="mb-2 text-muted" for="goodAnswer">Bonne réponse</label>
                <input type="text" class="form-control" id="goodAnswer" name="goodAnswer" value="${
                  questions[questionCount - 1] !== undefined ? questions[questionCount - 1][1] : ''
                }" required autofocus>
              </div>
            </div>`;
  let j = 2;
  for (let index = 0; index < numberBadAnswer; index++) {
    quizHTML += `
    <div class="row mb-3">
      <div class="col">
        <label class="mb-2 text-muted" for="badAnswer">Mauvaise réponse</label>
        <input type="text" class="form-control badAnswers" name="badAnswer" value="${
          questions[questionCount - 1] !== undefined ? questions[questionCount - 1][j] : ''
        }" required autofocus>
      </div>
    </div>`;
    j++;
  }
  if (questionCount === 1) {
    quizHTML += `
    <div class="mb-3 d-flex justify-content-end">
    <button type="submit" class="btn btn-primary " id="previousQuestion" style="display: none;">Précédent</button>
      <button type="submit" class="btn btn-outline-primary " id="nextQuestion">Suivant</button>
    </div>
  </form>
</div>
</div>
</div>
</div>
</section>
`;
  } else {
    quizHTML += `
    <div class="mb-3 d-flex justify-content-between">
      <button type="submit" class="btn btn-outline-info" id="previousQuestion">Précédent</button>
     `;

    if (questionCount === numberOfQuestions) {
      quizHTML += `<button type="submit" class="btn btn-primary  " id="nextQuestion">Terminer</button>`;
    } else {
      quizHTML += `<button type="submit" class="btn btn-outline-primary  " id="nextQuestion">Suivant</button>`;
    }

    quizHTML += `
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  main.innerHTML = quizHTML;
  attachEventListenersQuizQuestions();
}

function attachEventListenersQuizQuestions() {
  const previousQuestion = document.querySelector('#previousQuestion');
  const nextQuestion = document.querySelector('#nextQuestion');

  previousQuestion.addEventListener('click', (e) => {
    e.preventDefault();
    if (questionCount > 1) {
      questionCount--;
      renderQuizQuestions();
    }
  });

  nextQuestion.addEventListener('click', async (e) => {
    e.preventDefault();
    if (questionCount <= numberOfQuestions) {
      const question = document.querySelector('#question');
      const badAnswers = document.querySelectorAll('.badAnswers');
      const goodAnswer = document.querySelector('#goodAnswer');

      if (!question.value || !goodAnswer.value) {
        showError('Tous les champs du formulaire sont obligatoires'); 
        return renderQuizQuestions();
      }
      console.log('question : ', question.value);
      console.log('goodAnswer : ', goodAnswer.value);

      const answersBad = [];
      for (const answer of badAnswers) {
        if (!answer.value) {
          showError('Tous les champs du formulaire sont obligatoires'); 
          console.log('erreur');
          return renderQuizQuestions();
        }
        answersBad.push(answer.value);
      }
      console.log('on est dans le reste');
      const questAnsw = [question.value, goodAnswer.value, ...answersBad];

      console.log('questAnsw : ', questAnsw);
      console.log('questions : ', questions);

      if (questionCount === currentCount) {
        questions.push(questAnsw);
        questionCount++;
        currentCount++;
      } else {
        questions[questionCount - 1] = questAnsw;
        questionCount++;
      }

      if (questionCount <= numberOfQuestions) {
        console.log(`I am in nextQuestion.add ${questionCount}`);
        renderQuizQuestions();
      } else {
        const result = await Swal.fire({
          title: 'Êtes-vous sûr de vouloir créer ce quiz?',
          text: 'Une fois créé, le quiz ne pourra pas être modifié.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Oui, créer le quiz!',
          cancelButtonText: 'Annuler',
        });
        if (result.isConfirmed) {
          // hello
          console.log(userID);
          quizToBeCreated = {
            title: title.value,
            category: category.value,
            questions,
            currentUser: userID,
          };
          console.log('quizToBeCreated : ', quizToBeCreated);
          await addOneQuiz(quizToBeCreated);
          Navigate('/userSpace');
        } else {
          questionCount--;
          currentCount--;
          console.log('current', currentCount);
          return renderQuizQuestions();
        }
      }
    }
  });
}

export default CreateQuizPage;
