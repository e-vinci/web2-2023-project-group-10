// eslint-disable-next-line no-unused-vars
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import scienceImage from '../../img/science.jpg';
import historyImage from '../../img/history.jpg';
import generalCultureImage from '../../img/general_culture.jpg';
import economyImage from '../../img/economy.jpg';
import languagesImage from '../../img/languages.jpg';
import videoGamesImage from '../../img/video_games.jpg';
import mathematicsImage from '../../img/mathematics.jpg';
import cinemaImage from '../../img/cinema.jpg';
import computerScienceImage from '../../img/computer_science.jpg';
import geographyImage from '../../img/georaphy.jpg';
import sportImage from '../../img/sport.jpg';
import otherImage from '../../img/other.jpg';

const CategoriesPage = () => {
  clearPage();
  renderCategories();
  const cards = document.querySelectorAll('.card');
  /* manages category hover events */
  cards.forEach((card) => {
    card.addEventListener('mouseover', () => {
      // eslint-disable-next-line no-param-reassign
      card.style.borderWidth = '2px';
      card.classList.add('border-primary');
    });

    card.addEventListener('mouseout', () => {
      // eslint-disable-next-line no-param-reassign
      card.style.borderWidth = '1px';
      card.classList.remove('border-primary');
    });
  });
};

/* returns the categories page */
function renderCategories() {
  const main = document.querySelector('main');
  main.innerHTML = `
  <section>
  <div class="container-xxl">
     <h4>Catégories</h4>
</div>
  <div class="container-xxl">
  <div class="row mt-3">
  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${mathematicsImage}" alt="Image category mathematics">
      <div class="card-body">
        <p class="card-text">Mathématiques</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${historyImage}" alt="Image category history">
      <div class="card-body">
        <p class="card-text">Histoire</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${computerScienceImage}" alt="Image category computer science">
      <div class="card-body">
        <p class="card-text">Informatique</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${languagesImage}" alt="Image category languages">
      <div class="card-body">
        <p class="card-text">Langues</p>
      </div>
    </div>
  </a>
  </div>
  </div>

      <div class="row mt-3">
  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${sportImage}" alt="Image category sport">
      <div class="card-body">
        <p class="card-text">Sport</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${scienceImage}" alt="Image category science">
      <div class="card-body">
        <p class="card-text">Sciences</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${geographyImage}" alt="Image category geography">
      <div class="card-body">
        <p class="card-text">Géographie</p>
      </div>
    </div>
  </a>
  </div>

  <div class="col-12 col-lg-3 col-md-6">
  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
    <div class="card highlight-card" >
      <img class="custom-img img-fluid" src="${generalCultureImage}" alt="Image category general culture">
      <div class="card-body">
        <p class="card-text">Culture Générale</p>
      </div>
    </div>
  </a>
  </div>
      </div>


      <div class="row mt-3">
      <div class="col-12 col-lg-3 col-md-6">
      <a href="#" data-uri="/" class=" text-center text-decoration-none category">
        <div class="card highlight-card" >
          <img class="custom-img img-fluid" src="${videoGamesImage}" alt="Image categorie video games">
          <div class="card-body">
            <p class="card-text">Jeux Vidéos</p>
          </div>
        </div>
      </a>
      </div>
         

          <div class="col-12 col-lg-3 col-md-6">
          <a href="#" data-uri="/" class=" text-center text-decoration-none category">
            <div class="card highlight-card" >
              <img class="custom-img img-fluid" src="${economyImage}" alt="Image category economy">
              <div class="card-body">
                <p class="card-text">Economie</p>
              </div>
            </div>
          </a>
          </div>
        
              <div class="col-12 col-lg-3 col-md-6">
              <a href="#" data-uri="/" class=" text-center text-decoration-none category">
                <div class="card highlight-card" >
                  <img class="custom-img img-fluid" src="${cinemaImage}" alt="Image category cinema">
                  <div class="card-body">
                    <p class="card-text">Cinéma</p>
                  </div>
                </div>
              </a>
              </div>
  
                  <div class="col-12 col-lg-3 col-md-6">
                  <a href="#" data-uri="/" class=" text-center text-decoration-none category">
                    <div class="card highlight-card" >
                      <img class="custom-img img-fluid" src="${otherImage}" alt="Image category other">
                      <div class="card-body">
                        <p class="card-text">Autres</p>
                      </div>
                    </div>
                  </a>
                  </div>     
               </div>

            </div>
     </section>`;
}

export default CategoriesPage;
