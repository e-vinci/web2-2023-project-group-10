/* eslint-disable no-console */
/* eslint-disable no-plusplus */
// import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { readAllUsers } from '../../models/users';

let allUsers = [];
let ranking;
const RankingPage = async () => {
  allUsers = await readAllUsers();
  ranking = 1;
  renderRankingTable();
};

function renderRankingTable() {
  clearPage();
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
