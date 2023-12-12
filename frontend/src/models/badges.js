const readAllBadgesByUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/badges/?user-id=${id}`);
    if (!response.ok) {
      if (response.status === 400) {
        return [];
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const badges = await response.json();
    console.log('Badges :', badges);
    return badges;
  } catch (err) {
    console.error('readAllUserBadges::error: ', err);
    throw err;
  }
};

const readAllBadges = async () => {
  try {
    const response = await fetch(`http://localhost:3000/badges`);
    if (!response.ok) {
      if (response.status === 400) {
        console.log('reponse40000');
        return [];
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const badges = await response.json();
    console.log('Badges :', badges);
    return badges;
  } catch (err) {
    console.error('readAllBadges::error: ', err);
    throw err;
  }
};

export { readAllBadgesByUser, readAllBadges };
