import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';


function renderLoginForm() {
  const main = document.querySelector('main');

  main.innerHTML = 
  `
  <div id = "containerAuthentification">
    <div id = "squareLogin">
      <form>

        <div class = "title">
          <h1>LOGIN</h1>
        </div>
        
        <div class = "form-group">
          <input id = "username" type = "text" placeholder = "USERNAME">
        </div>
        
        <div class = "form-group">
          <input id = "password" type = "password" placeholder = "PASSWORD">
        </div>

        <div class = "form-group">
          <input type="checkbox" id="rememberMe">
          <label for="rememberMe">Remember me</label>
        </div>
        
        <div class = "form-group">
          <input id = "login" type = "button" value = "LOG IN">
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
