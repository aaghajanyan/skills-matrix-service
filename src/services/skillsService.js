import {SMConfig} from 'src/config';
import {get} from './client';


const getSkills = async () => {
    return get({url: `${SMConfig.apiEndpoints.skills}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export {getSkills};