import { clearPage } from '../../utils/render';
import quizLinkEventListeners from '../../utils/quiz';
import { readAllQuizzesByCategory } from '../../models/quizzes';
import Navigate from '../Router/Navigate';


let categoryName;

const QuizListPage = async () => {
  clearPage();
  const url = new URLSearchParams(window.location.search);
  categoryName = url.get('label');
  console.log('Le labell', categoryName);
  renderQuizListInCategory();
};

async function renderQuizListInCategory() {
  const quizzesInCategory = await readAllQuizzesByCategory(categoryName);
  const main = document.querySelector('main');
  let QuizList = '';
  const cardsInRow = 3; 
  let counter = 0;
  const numberOfQuiz = quizzesInCategory.length;

  QuizList = `
    <section>
        <div class="headerLabel">
            <h2>${categoryName}</h2>
        </div>
    </section>

    <section>
    <div class="container ">
    <div class="row mt-3 lowPart">
  `;
  if (numberOfQuiz === 0) {
    console.log('aucun quiz trouvé');
    QuizList += `   
    <div class="alert alert-light text-center alertQuizListPage" role="alert">
    <p>Aucun quiz n'a été créé pour cette catégorie.
    <a id = "createQuiz" class="alert-link" style="cursor: pointer">Sois le premier à en créer un !</a>
    </p>
  </div>
 `;
  } else {
    quizzesInCategory.forEach((q) => {
      if (counter === cardsInRow) {
        console.log('COUNTER:', counter);
        QuizList += `
      </div><div class="row mt-3 lowPart">
    `;
        counter = 0;
      }

      QuizList += `
    <div class="col-12 col-lg-3 mt-3">
    <a id_quiz = "${q.quiz_id}" class= "quiz text-decoration-none">
        <div class="card cardQuizzes">
            <div class="card-body">
               <h5 class="card-title">${q.title}</h5>
                <p class="card-text"> ${q.pseudo}</p>
            </div>
        </div>
        </a>
        </div>
  `;
      counter+=1;
      console.log('compteur apres incrementation', counter);
    });
  }
  QuizList += `

</div>
</div>
</section>
`;
  main.innerHTML = QuizList;

  if (numberOfQuiz === 0) {
    const btnCreateQuiz = document.getElementById('createQuiz');
    btnCreateQuiz.addEventListener('click', renderCreateQuiz);
  }
  quizLinkEventListeners();
  console.log('Categorie:');
}

function renderCreateQuiz() {
  Navigate('/create');
}

export default QuizListPage;
