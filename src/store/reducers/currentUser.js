import { SET_USER } from '../actions/currentUserAction';

export default function currentUser(state = null, action) {
    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                data: action.payload
            };

        default:
            return state;
    }
}