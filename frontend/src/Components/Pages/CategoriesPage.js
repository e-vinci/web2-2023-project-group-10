/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
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
import { readAllCategories } from '../../models/quizzes';

const CategoriesPage = async () => {
  clearPage();
  await renderCategories();
  const cards = document.querySelectorAll('.card');
  /* manages category hover events */
  cards.forEach((card) => {
    card.addEventListener('mouseover', () => {
      card.style.borderWidth = '2px';
      card.classList.add('border-primary');
    });

    card.addEventListener('mouseout', () => {
      card.style.borderWidth = '1px';
      card.classList.remove('border-primary');
    });
  });
};
/* returns the categories page */
async function renderCategories() {
  const main = document.querySelector('main');
  let mainCategory = ``;
  mainCategory += `
    <section>
      <div class="container-xxl">
        <h4>Catégories</h4>
      </div>
      <div class="container-xxl">
        <div class="row mt-3">
  `;
  let count = 0;
  const categories = await readAllCategories();
  categories.forEach((category) => {
    if (count % 4 === 0 && count !== 0) {
      mainCategory += `</div><div class="row mt-3">`;
    }
    mainCategory += `
        <div class="col-12 col-lg-3 col-md-6">
          <a href="/list?label=${category.label}" data-uri="/" class="text-center text-decoration-none category">
            <div class="card highlight-card">
              <img class="custom-img img-fluid" src="${getImageForCategory(
                category.label,
              )}" alt="Image category ${category.label}">
              <div class="card-body">
                <p class="card-text">${category.label}</p>
              </div>
            </div>
          </a>
        </div>
      `;
    count++;
  });

  mainCategory += `
      </div>
    </div>
  </section>`;
  main.innerHTML = mainCategory;
}

function getImageForCategory(categoryLabel) {
  if (categoryLabel === 'Mathématiques') return mathematicsImage;
  if (categoryLabel === 'Histoire') return historyImage;
  if (categoryLabel === 'Informatique') return computerScienceImage;
  if (categoryLabel === 'Langues') return languagesImage;
  if (categoryLabel === 'Sport') return sportImage;
  if (categoryLabel === 'Sciences') return scienceImage;
  if (categoryLabel === 'Géographie') return geographyImage;
  if (categoryLabel === 'Culture Générale') return generalCultureImage;
  if (categoryLabel === 'Jeux Vidéos') return videoGamesImage;
  if (categoryLabel === 'Economie') return economyImage;
  if (categoryLabel === 'Cinéma') return cinemaImage;
  if (categoryLabel === 'Autre') return otherImage;
}
export default CategoriesPage;
