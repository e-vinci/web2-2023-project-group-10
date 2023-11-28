// eslint-disable-next-line no-unused-vars
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import badge1 from '../../img/badge1.jpg';
import { readAllQuizzesByUser } from '../../models/quizzes';

const main = document.querySelector('main');

const UserSpacePage = () => {
  renderUserQuiz();
};

async function renderUserQuiz() {
  clearPage();
  let mainListQuiz = '';
  const allQuizzesByUser = await readAllQuizzesByUser(6); // a remplacer par l'id de l'utilisateur courant !!
  mainListQuiz = `
    <section>
      <div class="alert color-purple">
        <p>(afficher le nom)</p>
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

  // eslint-disable-next-line no-plusplus
  allQuizzesByUser.forEach((quiz) => {
    mainListQuiz += `   
   <div class="row">
   <div class="card shadow cardMyQuiz">
       <div class="card-body">
           <div class="row">
               <div class="col-md-4">
                  ${quiz.title}
               </div>
               <div class="col-md-4 text-center">
               ${new Date(quiz.date_creation).toLocaleDateString()}
               </div>
               <div class="col-md-4 text-end">
                   <button class="btn btn-danger">Supprimer</button>
                   <input type="hidden" id="quizToDelete" value=${quiz.quiz_id}>
               </div>
           </div>
       </div>
   </div>
</div>`;
  });

  mainListQuiz += `   
      </div>
      </div>
    </section>`;

  main.innerHTML = mainListQuiz;

  const linkBadge = document.querySelector('#linkBadge');

  linkBadge.addEventListener('click', () => {
    renderUserBadges();
  });
}

function renderUserBadges() {
  clearPage();
  main.innerHTML = `
    <section>
    <div class="alert color-purple">
    <p>(afficher le nom)</p>
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
      <div class="alert">
        <div class="container-xxl justify-content-center pt-5">
          <div class="card shadow-lg">
            <div class="card-body p-5">
      
            <div class="row mt-3">
            <div class="col-12 col-lg-3 col-md-6">
              <img src="${badge1}" alt="badge1" class="img-fluid">
            </div>

            <div class="col-12 col-lg-3 col-md-6">
            <p> Gerer les badges</p>
            <img src="" alt="badge2" class="img-fluid">
          </div>

          <div class="col-12 col-lg-3 col-md-6">
          <img src="" alt="badge3" class="img-fluid">
        </div>
        <div class="col-12 col-lg-3 col-md-6">
        <img src="" alt="badge4" class="img-fluid">
      </div>
        </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const linkListQuiz = document.querySelector('#linkListQuiz');

  linkListQuiz.addEventListener('click', () => {
    renderUserQuiz();
  });
}

export default UserSpacePage;
