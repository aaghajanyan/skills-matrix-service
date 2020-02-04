import {SMConfig} from 'src/config';
import {get} from './client';


const getCategoriesData = async () => {
    return get({url: `${SMConfig.apiEndpoints.categories}`})
        .then(result => result.data);
};

export {getCategoriesData};