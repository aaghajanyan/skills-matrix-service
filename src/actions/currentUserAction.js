

export const SET_USER = 'SET_USER';
export const DELETE_USER = 'DELETE_USER';

export const addUser = (currentUser) => ({
    type: SET_USER,
    payload: currentUser
});

export const setUser = () => ({
    type: SET_USER,
    placeholder: {}
});