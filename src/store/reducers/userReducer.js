import {SET_CURRENT_USER} from '../actions/userActions';


const USER_ACTIONS = {
    [SET_CURRENT_USER]: (state, action) => ({
        ...state,
        ...action.payload
    })
};

export default function userReducer(state = null, action) {
    const userAction = USER_ACTIONS[action.type];
    if(userAction) {return userAction(state, action);}
    return state;
}