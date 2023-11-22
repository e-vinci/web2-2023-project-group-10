import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';


function renderLoginForm() {
  const main = document.querySelector('main');

  main.innerHTML = `
  <div id = "containerAuthentification" class="container-xxl d-flex justify-content-center align-items-center pt-5">
    <div id = "squareLogin" class="w-75">
      <div class="card shadow-lg ">
        <div class="card-body p-5">
          <h2 class="fs-4 card-title fw-bold mb-4 text-center">Connexion</h2>
          <form>
          <div class="mb-3">
            <label class="mb-2 text-muted" for="email">Pseudo</label>
            <input id="username" type="text" class="form-control" name="email" value="" required autofocus placeholder = "baron12"/>
          </div>

        <div class="mb-3">
          <div class="mb-2 w-100">
          <label class="text-muted" for="password">Mot de passe</label>
        </div>
      <input id="password" type="password" class="form-control" name="password" required placeholder = "••••••••"/>
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="rememberMe">
        <label class="form-check-label" for="rememberMe">Se souvenir de moi</label>
      </div>

      <div class="mb-3">
      <input id="login" type="button" class="btn btn-stylem mn-3  w-100" value="Se connecter" />
      </div>

    <hr>

    <div class="mb-3">
      <input id="register" type="button" class="btn btn-outline-secondary mn-3  w-100" value = "Nouveau sur QUIZWIZ ? Créer un compte">
      </div>

      </form>
      </div>
    </div>
  `

  const btnRegister = document.getElementById('register');
  btnRegister.addEventListener('click',handleRegisterClick);

  const btnLogin = document.getElementById('login');
  btnLogin.addEventListener('click',handleLoginClick);
  
}


function  handleRegisterClick(){
  Navigate('/register');
}

async function handleLoginClick(e) {
  e.preventDefault();
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

  const response = await fetch('http://localhost:3000/users/login', options);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  Navigate('/categories');
}


const LoginPage = () => {
  clearPage();
  renderLoginForm();
};

export default LoginPage;
