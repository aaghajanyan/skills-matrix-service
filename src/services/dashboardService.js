import {SMConfig} from 'src/config';
import {get} from './client';

const getDashboardInfo = async (guid) => {

    const url = `${SMConfig.apiEndpoints.getUsers}${SMConfig.apiEndpoints.dashboard}/${guid}`;

    return get({url: url})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export { getDashboardInfo };