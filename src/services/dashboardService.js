import {SMConfig} from 'src/config';
import {get} from './client';


const getDashboardInfo = (guid) => {
    const url = guid !== undefined ? `${SMConfig.apiEndpoints.getUsers}${SMConfig.apiEndpoints.dashboard}/${guid}` : `${SMConfig.apiEndpoints.getUsers}${SMConfig.apiEndpoints.dashboard}`
    return get({url: url})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export { getDashboardInfo };