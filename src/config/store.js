import { createStore, combineReducers, applyMiddleware } from 'redux';
import Search from '../reducers/search';
import thunk from "redux-thunk";
const reducers = combineReducers({ Search });

const store = createStore(reducers, applyMiddleware(thunk));

export default store;