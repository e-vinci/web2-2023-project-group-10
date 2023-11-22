import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';


function renderRegister() {
    const main = document.querySelector('main');

    main.innerHTML = 
    `
    <div id = "containerAuthentification"> 
      <div id = "squareRegister">
        <form>

          <div class = "title">
            <h1>REGISTER</h1>
          </div>

          <div class = "form-group">
            <input id = "username" type = "text" placeholder = "USERNAME">
          </div>

          <div class = "form-group">
            <input id = "password" type = "password" placeholder = "PASSWORD">
          </div>

          <div class = "form-group">
            <input id = "conf-password" type = "password" placeholder = "CONFIRM YOUR PASSWORD">
          </div>

          <div class = "form-group">
            <input id = "register" type = "button" value = "REGISTER">
          </div>

        </form>
      </div>
    </div>
    
    `

    const btnRegister = document.getElementById('register');
    btnRegister.addEventListener('click',handleRegisterClick);
}

async function handleRegisterClick() {
 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const options = {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch('http://localhost:3000/users/register', options);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  Navigate('/categories');
}




const RegisterPage = () => {
  clearPage();
  renderRegister();
};


export default RegisterPage;
