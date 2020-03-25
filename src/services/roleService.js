import {SMConfig} from 'src/config';
import {get} from './client';


const getRoles = async () => {
    return get({url: `${SMConfig.apiEndpoints.roles}`})
        .then(result => result.data)
};
export {getRoles};