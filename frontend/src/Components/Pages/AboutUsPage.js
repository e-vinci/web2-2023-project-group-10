import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';

const aboutUs = () => {
  clearPage();
  renderGoBackHomeButton();

  const main = document.querySelector('main');
  main.innerHTML = `

  <section id="SectionMain">
    <section class="banner pt-5 d-flex justify-content-center align-items-center ">
      <div class="container my-5 py-5">
        <div class="row">
          <div class="col-md-12 col-12 col-lg-6 text-center d-flex align-items-center justify-content-center">
            <h1 class="titleAU"> L'EQUIPE </h1>
          </div>
          <div class="col-12 col-lg-6 col-md-12">
            <h3 class="textAU"> Nous sommes cinq étudiants en deuxième année en informatique
                                spécialisés dans le développement d'applications 
                                à la Haute Ecole Léonard de Vinci. 
            </h3>
          </div>
        </div>
      </div>
    </section>
      
      <svg style="background color:#D9EEE1;" width="100%" height="70" viewBox="0 0 100 100"' preserveAspectRatio="none"> 
        <path id="wavepath" d="M0, 0 L110, 0C35,150 35,0 0,100z" fill="#F4EEFF"></path>
      </svg>
      
      <section class="pt-5 d-flex justify-content-center align-items-center ">
        <div class="container my-5 py-5">
          <div class="row">
            <div class="col-12 col-lg-6 col-md-12 text-center mb-4">
            <h1 class="titleAU"> NOTRE PROJET </h1>
            </div>
            <div class="col-md-12 col-12 col-lg-6 text-center d-flex align-items-center">
              <h3 class="textAU">Dans le cadre de notre cours, nous avons conçu et développé un jeu de quiz éducatif. 
                                 Lors cette expérience interactive, les utilisateurs peuvent choisir parmi des catégories prédéfinies ou même 
                                 créer leurs propres quiz. Qu'ils préfèrent tester leurs connaissances ou défier leurs amis, notre plateforme 
                                 offre un éventail d'options de quiz passionnants.
                                 À la fin de chaque quiz, les joueurs reçoivent un score qui reflète leur performance, 
                                 et ils ont également la possibilité de gagner une collection de badges. 
                                 Ces badges sont des récompenses que les joueurs peuvent accumuler en participant activement au jeu.
             </h3>
            </div>
          </div>
        </div>
      </section>



      <section id="SectionMain">
      <section class="banner pt-5 d-flex justify-content-center align-items-center ">
        <div class="container my-5 py-5 ">
          <div class="row">
            <div class="col-md-12 col-12 col-lg-6 text-center d-flex align-items-center justify-content-center">
            <h1 class="titleAU"> CONTACTER NOUS </h1>
            </div>
            <div class="col-12 col-lg-6 col-md-12">
              <h3 class="textAU"> Nous sommes cinq étudiants en deuxième année en informatique
                                  spécialisés dans le développement d'applications 
                                  à la Haute Ecole Léonard de Vinci. 
              </h3>
            </div>
          </div>
        </div>
      </section>



  
</section>`;
};

function renderGoBackHomeButton() {
  const main = document.querySelector('main');
  const submit = document.createElement('input');
  submit.value = 'aboutus';
  submit.className = 'btn btn-secondary mt-3';
  submit.addEventListener('click', () => {
    Navigate('/');
  });

  main.appendChild(submit);
}

export default aboutUs;
