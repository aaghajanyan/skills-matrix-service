import {SMConfig} from 'src/config';
import {get} from './client';


const getCategories = async () => {
    return get({url: `${SMConfig.apiEndpoints.categories}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export {getCategories};