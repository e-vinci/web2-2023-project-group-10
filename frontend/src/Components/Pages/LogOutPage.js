import Swal from 'sweetalert2';
import Navbar from '../Navbar/Navbar';
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userID");
    Swal.fire({
        title: "Deconnexion réussie!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });

      Navbar();

      Navigate('/');

}

const LogOutPage = () => {
  clearPage();
  logout();

};

export default LogOutPage;