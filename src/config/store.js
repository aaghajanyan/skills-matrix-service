import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import Search from '../reducers/search';
import thunk from "redux-thunk";
const composeEnhancers = process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'SkillMatrix', actionsBlacklist: ['REDUX_STORAGE_SAVE']
    }) : compose;

const enhancer = composeEnhancers( applyMiddleware(thunk) );
const reducers = combineReducers({ Search });

const store = createStore(reducers, enhancer);

export default store;