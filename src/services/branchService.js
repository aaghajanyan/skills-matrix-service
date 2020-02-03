import {SMConfig} from 'src/config';
import {get} from './client';


const getBranches = async () => {
    return get({url: `${SMConfig.apiEndpoints.branches}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export {getBranches};