// ----------------------------------------- HOME PAGE -----------------------------------------

// ----------------------------------------- IMPORTS -----------------------------------------

import imagePInterro from '../../img/quizImage.png';
import imagePencil from '../../img/pencil.png';

// ----------------------------------------- HOME PAGE MIDDLEWARE  -----------------------------------------

const HomePage = () => {
  const main = document.querySelector('main');
  main.innerHTML = `
  <section id="SectionMain">
  <section class="banner pt-5 d-flex justify-content-center align-items-center ">
    <div class="container my-5 py-5">
      <div class="row">
      <div class="col-md-6 text-center">
          <h1  >
          Prêt à explorer l'univers des quiz ? Découvrez une multitude de catégories et mettez vos connaissances à l'épreuve !
          </h1>
          </div>
          <div class="col-md-6 text-center">
          <h1  >
          <img  class= "imagePInterro" src="${imagePInterro}" alt="imagePInterro">
          </h1>
          </div>
 
          </div>
 
     <div class="row  mt-2">
          <div class="col-md-6 text-center">
          <a class="btn btn-style" href="#" data-uri="/categories">Catégorie</a>
 
        </div>
    </div>
 

  </section>

  <section class="banner pt-5 d-flex justify-content-center align-items-center ">
  <div class="container my-5 py-5">
    <div class="row">
      <div class="col-md-6 text-center order-md-1">
      <h1> <img  class= "imagePencil" src="${imagePencil}" alt="imagePencil"> <h1> 
      </div>
      <div class="col-md-6 text-center order-md-2">
        <h1>
          Laissez-vous emporter par votre imagination et créez votre propre QuizWiz !
        </h1>
        
        <div class="row mt-2">
          <div class="col-md-6 text-center">
            <a href="#Créer ton quiz" class="btn btn-style">Créez votre QuizWiz</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

 

  <section id="bannerCreation" class="bannerCreation d-flex align-items-center bg-white   "> 
    <div class="container ">
  
    <div class="row">
      <div class="col-md-12 pb-5">
      <h3 class="text-center" >
         Envie de créez votre propre quiz en seulement quelques clics ?
          </h3> 
        </div>
        </div>
      
        <div class="row mt-2">
        <div class="col-md-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16">
        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
      </svg>
        </div>
 
        <div class="col-md-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-highlighter" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M11.096.644a2 2 0 0 1 2.791.036l1.433 1.433a2 2 0 0 1 .035 2.791l-.413.435-8.07 8.995a.5.5 0 0 1-.372.166h-3a.5.5 0 0 1-.234-.058l-.412.412A.5.5 0 0 1 2.5 15h-2a.5.5 0 0 1-.354-.854l1.412-1.412A.5.5 0 0 1 1.5 12.5v-3a.5.5 0 0 1 .166-.372l8.995-8.07.435-.414Zm-.115 1.47L2.727 9.52l3.753 3.753 7.406-8.254-2.905-2.906Zm3.585 2.17.064-.068a1 1 0 0 0-.017-1.396L13.18 1.387a1 1 0 0 0-1.396-.018l-.068.065 2.85 2.85ZM5.293 13.5 2.5 10.707v1.586L3.707 13.5h1.586Z"/>
      </svg>
 
        </div>
 
        <div class="col-md-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-person-arms-up" viewBox="0 0 16 16">
        <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
        <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.492 1.492 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.72.72 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.72.72 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
      </svg>
 
        </div>
        </div>
 
        <div class="row mt-2">
        <div class="col-md-4 text-center">
        <h4>  <a href="#" data-uri="/"> Inscrivez-vous </a>gratuitement </h4>
        </div>
 
        <div class="col-md-4 text-center"> 
        <h4>  Créer vos propre quiz </h4>
        </div>
        <div class="col-md-4 text-center">
        <h4> Apprenez tout en vous amusant ! </h4>
        </div>
      </div>
    </div>
  </section>
 
  </section>`;
};
 
export default HomePage;
 