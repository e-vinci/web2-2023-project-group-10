// eslint-disable-next-line no-unused-vars
import { Navbar as BootstrapNavbar } from 'bootstrap';
import Swal from 'sweetalert2';
import logo from '../../img/logo.png';
import Navigate from '../Router/Navigate';

/**
 * Render the Navbar which is styled by using Bootstrap
 * Each item in the Navbar is tightly coupled with the Router configuration :
 * - the URI associated to a page shall be given in the attribute "data-uri" of the Navbar
 * - the router will show the Page associated to this URI when the user click on a nav-link
 */

const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');

  const isLogged = localStorage.getItem('token') || sessionStorage.getItem('token');

  let loginOrLogoutLink;
  let createLink;
  let userSpace;

  if (isLogged) {
    loginOrLogoutLink = `<a id = "logOut"class="nav-link">Déconnexion</a>`;
    createLink = `<li class="nav-item"><a class="nav-link" aria-current="page" href="#" data-uri="/create">Créer</a></li>`;
    userSpace = `<a class="nav-link" href="#" data-uri="/userSpace">Mon espace</a>`;
  } else {
    loginOrLogoutLink = `<a class="nav-link text-white btn-purple text-center" href="#" data-uri="/login">Connexion</a>`;
    createLink = '';
    userSpace = '';
  }

  const navbar = `
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
      
       <div class="container-fluid">
          <a class="nav-link" href="#"  data-uri="/" >
          <img class= "logo" src="${logo}" alt="Logo" data-uri="/">
          </a>
          
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                ${createLink} 
              <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/categories">Categories</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/aboutUs">À propos</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/ranking">Classement</a>
              </li>  
            </ul>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              ${userSpace}
            </li>
            <li class="nav-item">
              ${loginOrLogoutLink}
            </li>
          </ul>
        </div>
        </div>
      </nav>
  `;
  navbarWrapper.innerHTML = navbar;

  const btnLogOut = document.getElementById('logOut');
  if(btnLogOut !== null){
    btnLogOut.addEventListener('click', handleLogout);
  }
  
};

function handleLogout() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  Navbar();
  Swal.fire({
    title: 'Deconnexion reussie',
    icon: 'success',
    timer: 1000,
    showConfirmButton: false,
  });

  Navigate('/categories');
}

export default Navbar;
