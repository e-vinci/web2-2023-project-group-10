/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
// eslint-disable-next-line no-unused-vars
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import trophee from '../../img/badge1.jpg';
import { readAllQuizzesByUser, deleteOneQuiz } from '../../models/quizzes';
import { readAllBadgesByUser } from '../../models/badges';

const main = document.querySelector('main');

const UserSpacePage = () => {
  renderUserQuiz();
};

const username = localStorage.getItem('username');
console.log('Récupération du username:', username);
const userID = localStorage.getItem('user_id');
console.log('Récupération user id', userID);

async function renderUserQuiz() {
  clearPage();
  let mainListQuiz = '';
  const allQuizzesByUser = await readAllQuizzesByUser(userID);
  mainListQuiz = `
    <section>
      <div class="alert color-purple">
        <p>Bienvenue ${username}</p>
      </div>
      <nav class="navbar navbar-expand-lg ">
      <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav navbar-userSpace">
              <li class="nav-item">
                <a class="nav-link styleLink styleLinkHover" id="linkListQuiz" >Mes quiz</a>
              </li>
              <li class="nav-item">
                <a class="nav-link styleLinkHover" id="linkBadge" >Mes badges</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="alert">
        <div class="container-xxl justify-content-center pt-5 "> 
     `;

  if (allQuizzesByUser.length === 0) {
    mainListQuiz += `   
    <div class="alert alert-light text-center">
    <p>Vous n'avez pas encore créé de quiz !</p>
  </div>
          `;
  } else {
    allQuizzesByUser.forEach((quiz) => {
      mainListQuiz += `   
     <div class="row">
     <div class="card shadow cardMyQuiz">
         <div class="card-body">
          <p id="deletedReponse"></p>
             <div class="row">
                 <div class="col-md-4">
                    ${quiz.title}
                 </div>
                 <div class="col-md-4 text-center">
                 ${new Date(quiz.date_creation).toLocaleDateString()}
                 </div>
                 <div class="col-md-4 text-end">
                  <button class="btn btn-danger delete-quiz-btn" data-id=${
                    quiz.quiz_id
                  }>Supprimer</button>
                 </div>

             </div>
         </div>
     </div>
 </div>`;
    });
  }
  mainListQuiz += `   
      </div>
      </div>
    </section>`;

  main.innerHTML = mainListQuiz;

  const linkBadge = document.querySelector('#linkBadge');

  linkBadge.addEventListener('click', () => {
    renderUserBadges();
  });

  attachDeleteEventListeners();
}

function attachDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-quiz-btn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      console.log('front btn ');
      e.preventDefault();
      const deleteQuiz = e.target.dataset.id;
      const message = document.querySelector('#deletedResponse');
      try {
        const reponse = await deleteOneQuiz(deleteQuiz);
        console.log(`la reponse du frontttttttttttttttt  ::    ${reponse.status}`);

        if (!reponse.ok) {
          message.className = 'text-danger';
          message.innerHTML = `Votre quiz n'a pas été supprimé`;
          Navigate('/login');
        } else {
          message.className = 'text-success';
          message.innerHTML = `Votre quiz a été supprimé`;
          console.log('Votre quiz a été supprimé dans le front');

          Navigate('/register');
        }
        renderUserQuiz();
      } catch (error) {
        console.error('Erreur lors de la suppression du quiz:', error);
        Navigate('/login');
      }
    });
  });
}

async function renderUserBadges() {
  clearPage();
  const allBadgesByUser = await readAllBadgesByUser(userID);
  let mainUserBadges = `
    <section>
    <div class="alert color-purple">
    <p>Bienvenue ${username}</p>
  </div>
    <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link styleLinkHover" id="linkListQuiz" >Mes quiz</a>
              </li>
              <li class="nav-item">
                <a class="nav-link styleLink styleLinkHover" id="linkBadge">Mes badges</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      `;

  if (allBadgesByUser.length === 0) {
    mainUserBadges += `   
              <div class="alert alert-light text-center">
              <p>Vous n'avez pas encore gagné de badge !</p>
            </div>`;
  } else {
    mainUserBadges += `
          <div class="alert">
          <div class="container-xxl justify-content-center pt-5">
            <div class="card shadow-lg">
              <div class="card-body p-5"> 
              <div class="row mt-3">`;
    let count = 0;
    allBadgesByUser.forEach((badge) => {
      if (count % 3 === 0 && count !== 0) {
        mainUserBadges += ' </div>  <div class="row mt-3">';
      }
      mainUserBadges += ` <div class="col-12 col-lg-3 col-md-6">
                <img src="${getImageForBadge(badge.label)}"  alt="${badge.label}" class="img-fluid">
              </div>`;
      count++;
    });
    mainUserBadges += `
        </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  main.innerHTML = mainUserBadges;
  const linkListQuiz = document.querySelector('#linkListQuiz');

  linkListQuiz.addEventListener('click', () => {
    renderUserQuiz();
  });
}

function getImageForBadge(badgeLabel) {
  if (badgeLabel === `Trophée d'or`) return trophee;
}
export default UserSpacePage;
