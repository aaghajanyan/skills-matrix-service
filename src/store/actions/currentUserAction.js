export const SET_USER = 'SET_USER';

export const setCurrentUser = (currentUser) => ({
    type: SET_USER,
    payload: currentUser
});