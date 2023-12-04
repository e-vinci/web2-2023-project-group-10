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
            title: 'Erreur de Connexion',
            text: `Impossible de récupérer les détails de l'utilisateur. Erreur: ${error.message}. Veuillez réessayer ultérieurement.`,
            icon: 'error',
        });
        
          return null;
    }
}
