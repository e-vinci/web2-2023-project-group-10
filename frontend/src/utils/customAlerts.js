import Swal from 'sweetalert2';


function showSuccess(message) {
    Swal.fire({
      icon: 'success',
      text: message,
      timer: 1000,
      showConfirmButton: false,
    });
  }

  function showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      showConfirmButton: true,
    });
  }


  export{showSuccess, showError}