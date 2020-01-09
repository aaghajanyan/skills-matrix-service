import { addUser } from './currentUserAction';

export function setUser(data) {
    return (dispatch) => {
        dispatch(addUser(data));
    }
}