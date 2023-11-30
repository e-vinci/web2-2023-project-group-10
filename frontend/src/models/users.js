/* eslint-disable import/prefer-default-export */
const readAllUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/users');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const users = await response.json();
    console.log('Categories :', users);
    return users;
  } catch (err) {
    console.error('readAllUsers::error: ', err);
    throw err;
  }
};

export { readAllUsers };
