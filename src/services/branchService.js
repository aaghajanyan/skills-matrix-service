import {SMConfig} from 'src/config';
import {get} from './client';


const getBranches = async () => {
    return get({url: `${SMConfig.apiEndpoints.branches}`})
        .then(result => result.data)
};

export {getBranches};