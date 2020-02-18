import {SMConfig} from 'src/config';
import {get} from './client';
import { resolve } from 'dns';


const getUser = (guid) => {
    return get({url: `${SMConfig.apiEndpoints.getUsers}/${guid}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

const getUsers = () => {
    return get({url: SMConfig.apiEndpoints.getUsers})
        .then(result => result.data);
};

const getCurrentUser = () => {
    const options = {
        url: SMConfig.apiEndpoints.getCurrentUser
    };
    return get(options)
        .then(user => user.data)
        .catch(error => {
            if(error.response) {
                return Promise.reject(error.response.data.message);
            }
        });
};

export {getUser, getUsers, getCurrentUser};