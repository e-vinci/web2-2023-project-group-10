/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { readAllCategories, addOneQuiz } from '../../models/quizzes';

const questions = [];
let questionCount = 0;
let numberOfQuestions = 0;
const numberBadAnswer = 3;
let title;
let category;
let quizToBeCreated;
const main = document.querySelector('main');

function showAlert(message) {
  alert(message);
}

const CreateQuizPage = async () => {
  clearPage();
  await renderFormInfoQuiz(); // wait for renderFormInfoQuiz to finish before continuing
  attachEventListenersFromInfoQuiz();
};

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
}

function attachEventListenersFromInfoQuiz() {
  const btnSubmitNumber = document.querySelector('#btnSubmitNumber');
  const btnInfo = document.querySelector('#btnInfo');
  title = document.querySelector('#titleQuiz');
  category = document.querySelector('#category');

  btnInfo.addEventListener('click', (e) => {
    e.preventDefault();
    showAlert('Le nombre maximum de question autorisé est de 70');
  });

  btnSubmitNumber.addEventListener('click', (e) => {
    e.preventDefault();
    numberOfQuestions = parseInt(document.querySelector('#numberQuestion').value, 10);
    console.log(numberOfQuestions);
    questionCount = 1;
    if (!isNaN(numberOfQuestions) && numberOfQuestions > 0) renderQuizQuestions();
    // else error
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
                <input type="text" class="form-control" id="question" name="question" required autofocus>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="mb-2 text-muted" for="goodAnswer">Bonne réponse</label>
                <input type="text" class="form-control" id="goodAnswer" name="goodAnswer" required autofocus>
              </div>
            </div>
`;

  for (let index = 0; index < numberBadAnswer; index++) {
    quizHTML += `
    <div class="row mb-3">
      <div class="col">
        <label class="mb-2 text-muted" for="badAnswer">Mauvaise réponse</label>
        <input type="text" class="form-control badAnswers" name="badAnswer" required autofocus>
      </div>
    </div>
  `;
  }

  quizHTML += `
            <div class="mb-3">
            <button type="submit" class="btn btn-primary mn-3" id="previousQuestion">Précédent</button>
              <button type="submit" class="btn btn-primary mn-3" id="nextQuestion">Suivant</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
`;
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
  // rajouter le form préremplie avec les bonne infos
  nextQuestion.addEventListener('click', async (e) => {
    e.preventDefault();
    questionCount++;
    const question = document.querySelector('#question');
    const badAnswers = document.querySelectorAll('.badAnswers');
    const goodAnswer = document.querySelector('#goodAnswer');

    console.log('question : ', question.value);
    console.log('goodAnswer : ', goodAnswer.value);

    const answersBad = [];
    badAnswers.forEach((answer) => {
      answersBad.push(answer.value);
    });

    const questAnsw = [question.value, goodAnswer.value, ...answersBad];

    console.log('questAnsw : ', questAnsw);
    console.log('questions : ', questions);
    questions.push(questAnsw);

    if (questionCount <= numberOfQuestions) {
      console.log(`I am in nextQuestion.add ${questionCount}`);
      renderQuizQuestions();
    } else {
      quizToBeCreated = {
        title: title.value,
        category: category.value,
        questions,
      };
      console.log('quizToBeCreated : ', quizToBeCreated);
      await addOneQuiz(quizToBeCreated);
      Navigate('/categories');
      console.log(`Ici, on va direct être rediriger vers la page du jeu du quiz`); // A MODIF
    }
  });
}

export default CreateQuizPage;
