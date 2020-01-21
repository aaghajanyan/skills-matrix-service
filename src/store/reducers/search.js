import {
    SEARCH_USERS_BEGIN,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_FAILURE,
    CRITERIA_ROW
  } from '../actions/searchAction';


export default function Seacrh(state = {}, action){
    switch(action.type) {

        case SEARCH_USERS_BEGIN:
          return {
            ...state,
            loading: true,
            error: null
          };

        case SEARCH_USERS_SUCCESS:
          return {
            ...state,
            loading: false,
            items: action.payload.users
          };

        case SEARCH_USERS_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            items: []
          };

        case CRITERIA_ROW:
        return {
            ...state,
            loading: false,
            items: action.payload
        };

        default:
          return state;
      }
}



