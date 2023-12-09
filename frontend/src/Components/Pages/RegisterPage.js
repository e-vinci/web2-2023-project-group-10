import Swal from 'sweetalert2';
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';



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
</div>`

    const btnRegister = document.getElementById('register');
    btnRegister.addEventListener('click',handleRegisterClick);
}

async function handleRegisterClick() {
 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const verifPassword = document.getElementById('conf-password').value;

  console.log('les password du client ', password, verifPassword);

  if(password !== verifPassword){
    Swal.fire({
      title: "Les mots de passe ne correspondent pas",
      icon: "error",
      showConfirmButton: true
    });
  }else{
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
      Swal.fire({
        title: "Le pseudo existe deja",
        icon: "error",
        showConfirmButton: true
      });
    }else{
      Swal.fire({
        title: "Inscription réussie!",
        text: "Votre compte a été créé avec succès.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });

      Navigate('/login');
    }


  }
  Navigate('/categories');
}


const RegisterPage = () => {
  clearPage();
  renderRegister();
};


export default RegisterPage;
