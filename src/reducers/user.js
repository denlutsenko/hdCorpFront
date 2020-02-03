let userInStorage = localStorage.getItem('user');

if (userInStorage) {
  userInStorage = JSON.parse(userInStorage);
}

export default function user(state = userInStorage, action) {
  if (action.type === 'SET_USER') {
    const { id, firstName, lastName } = action.user;
    return {
      id,
      firstName,
      lastName
    } 
  } else if (action.type === 'CLEAR_USER') {
    return null; 
  }
  return state;
}