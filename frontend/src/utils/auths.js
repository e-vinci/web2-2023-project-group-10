import Swal from 'sweetalert2';

export default async function getConnectedUserDetails() {
    try {
        const token = localStorage.getItem('token');
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch('http://localhost:3000/users/details', options);
      
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
            
          
        }
        
        const data = response.json();
        return data;

        
    } catch (error) {
        Swal.fire({
            title: 'Erreur lors de la création du quiz',
            text: error.message,
            icon: 'error',
          });
          return null;
    }
}
