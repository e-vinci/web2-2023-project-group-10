import Navigate from '../Components/Router/Navigate';

export default function quizLinkEventListeners() {
  const btnCategory = document.querySelectorAll('.quiz');
  btnCategory.forEach((quizLink) => {
    quizLink.addEventListener('click', (e) => {
      e.preventDefault();
      const quizId = e.currentTarget.getAttribute('id_quiz');
      console.log('helloworld');
      console.log(quizId);
      Navigate(`/quiz?id=${quizId}`);
    });
  });
}
