import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import RankingPage from '../Pages/RankingPage';
import CreateQuizPage from '../Pages/CreateQuizPage';
import AboutusPage from '../Pages/AboutUsPage';
import CategoriesPage from '../Pages/CategoriesPage';
import UserSpacePage from '../Pages/UserSpacePage';
import quizPage from '../Pages/QuizPage';
import logOutPage from '../Pages/LogOutPage';
import QuizListPage from '../Pages/QuizListPage';


const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/login':LoginPage,
  '/register':RegisterPage,
  '/ranking': RankingPage,
  '/create': CreateQuizPage,
  '/aboutUs': AboutusPage,
  '/categories': CategoriesPage,
  '/userSpace': UserSpacePage,
  '/quiz' : quizPage,
  '/logout' : logOutPage,
  '/list' : QuizListPage,

}
  

export default routes;
