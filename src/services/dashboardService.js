import {SMConfig} from 'src/config';
import {get} from './client';


const getDashboardInfo = () => {
    return get({url: `${SMConfig.apiEndpoints.getUsers}${SMConfig.apiEndpoints.dashboard}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export { getDashboardInfo };