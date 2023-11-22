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
      <div class="col-md-6 text-center">
      <h1 class="titleAU"> L'EQUIPE </h1>
          </div>
          <div class="col-md-6 text-center">
          <h2 class="textAU"> Nous sommes cinq étudiants en deuxième année en informatique
          spécialisés dans le développement d'applications à la Haute Ecole Léonard de Vinci. <h2>
          </div>
 
          </div>
 

 

  </section>

  <section class="banner pt-5 d-flex justify-content-center align-items-center ">
  <div class="container my-5 py-5">
    <div class="row">
      <div class="col-md-6 text-center order-md-1">
      <h1 class="titleAU"> NOTRE PROJET </h1>
      </div>
      <div class="col-md-6 text-center order-md-2">
      <h2 class="textAU" >Dans le cadre de notre cours, nous avons conçu et développé un jeu de quiz éducatif. 
      Lors cette expérience interactive, les utilisateurs peuvent choisir parmi des catégories prédéfinies ou même 
      créer leurs propres quiz. Qu'ils préfèrent tester leurs connaissances ou défier leurs amis, notre plateforme 
      offre un éventail d'options de quiz passionnants.
      À la fin de chaque quiz, les joueurs reçoivent un score qui reflète leur performance, 
      et ils ont également la possibilité de gagner une collection de badges. 
      Ces badges sont des récompenses que les joueurs peuvent accumuler en participant activement au jeu. </h2>
    
        
    
      </div>
    </div>
  </div>
</section>


  <h1 class="titleAU"> CONTACTER NOUS </h1>


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
