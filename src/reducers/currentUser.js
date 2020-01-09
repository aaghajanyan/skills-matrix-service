import { SET_USER, DELETE_USER } from '../actions/currentUserAction';

export default function currentUser(state = {}, action) {
    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                currentUser: action.payload
            };

            case DELETE_USER:
                return {
                    ...state,
                    currentUser: {}
                };

        default:
            return state;
    }
}