/* eslint-disable no-plusplus */
// import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';

let allUsers = [];
let ranking = 1;
const RankingPage = async () => {
  clearPage();
  try {
    const response = await fetch('http://localhost:3000/users');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    allUsers = await response.json();
  } catch (err) {
    console.error('HTTP error : ', err);
    throw err;
  }
  renderRankingTable();
};

function renderRankingTable() {
  const main = document.querySelector('main');
  let mainRanking = `
  <section>
<div class="container-xxl mt-5">
      <table class="table table-striped table-hover mt-4">
        <thead>
            <tr>
                <th>Classement</th>
                <th>Pseudo</th>
                <th>Point totale</th>
            </tr>
        </thead>
        <tbody> 
    `;
  allUsers.forEach((user) => {
    mainRanking += `
      <tr>
      <td> ${ranking} </td>
      <td>  ${user.pseudo} </td>
      <td> ${user.total_point} </td>
    </tr>`;
    ranking++;
  });
  mainRanking += `    
  </tbody>
</table>
</div>
</section>`;

  main.innerHTML = mainRanking;
}

export default RankingPage;
