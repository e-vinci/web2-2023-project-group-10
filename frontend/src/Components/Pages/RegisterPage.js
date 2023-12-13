import Swal from 'sweetalert2';
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { logIn, register } from '../../models/users';
import Navbar from '../Navbar/Navbar';

function renderRegister() {
  const main = document.querySelector('main');

  main.innerHTML = `
    <div id="containerAuthentification" class="container-xxl d-flex justify-content-center align-items-center pt-5">
    <div id="squareRegister" class="w-75">
        <div class="card shadow-lg ">
            <div class="card-body p-5">
                <h2 class="fs-4 card-title fw-bold mb-4 text-center">Inscription</h2>
                <form>
                    <div class="mb-3">
                        <label class="mb-2 text-muted" for="email">Pseudo</label>
                        <input id="username" type="text" class="form-control" name="email" value="" required
                            autofocus placeholder="baron12" />
                    </div>

                    <div class="mb-3">
                        <div class="mb-2 w-100">
                            <label class="text-muted" for="password">Mot de passe</label>
                        </div>
                        <input id="password" type="password" class="form-control" name="password" required
                            placeholder="••••••••" />
                    </div>

                    <div class="mb-3">
                        <div class="mb-2 w-100">
                            <label class="text-muted" for="password">Confirmation du mot de passe</label>
                        </div>
                        <input id="conf-password" type="password" class="form-control" name="password" required
                            placeholder="••••••••" />
                    </div>

                    <div class="mb-3">
                        <input id="register" type="button" class="btn btn-authentification mn-3  w-100"
                            value="S'inscrire" />
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>`;

  const btnRegister = document.getElementById('register');
  btnRegister.addEventListener('click', handleRegisterClick);
}

async function handleRegisterClick() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const verifPassword = document.getElementById('conf-password').value.trim();

  console.log('les password du client ', password, verifPassword);

  if (!username || !password || !verifPassword) {
    showError('Tous les champs du formulaire sont obligatoires');
    return;
  }
  if (password !== verifPassword) {
    showError('Les mots de passe ne correspondent pas');
    return;
  }
  try {
    const response = await register(username, password);

    if (!response.ok) {
      showError('Le pseudo existe deja');
      return;
    }
    const responseLogin = await logIn(username, password);

    const responseData = await responseLogin.json();

    if (responseData && responseData.token) {
      sessionStorage.setItem('token', responseData.token);
      showSucces('Vous etes connecter');
    } else {
      showError('Une erreurs est survenue');
      return;
    }

    Navbar();
    Navigate('/categories');
  } catch (err) {
    showError("Une erreur est survenue lors de l'inscription");
    console.error('Register Error:', err);
  }
}

const RegisterPage = () => {
  clearPage();
  renderRegister();
};

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    showConfirmButton: true,
  });
}

function showSucces(message) {
  Swal.fire({
    icon: 'success',
    text: message,
    timer: 1000,
    showConfirmButton: false,
  });
}

export default RegisterPage;
