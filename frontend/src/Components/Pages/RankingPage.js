import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';

const RankingPage = () => {
  clearPage();
  renderGoBackHomeButton();
};

function renderGoBackHomeButton() {
    const main = document.querySelector('main');
    const submit = document.createElement('input');
    submit.value = 'RankingPage';
    submit.className = 'btn btn-secondary mt-3';
    submit.addEventListener('click', () => {
      Navigate('/');
    });
  
    main.appendChild(submit);
}

export default RankingPage;
