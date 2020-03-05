import {SMConfig} from 'src/config';
import {get} from './client';

const getCategoryHistoryInfo = async (guid) => {

    const url = `${SMConfig.apiEndpoints.users_categories}${SMConfig.apiEndpoints.history}/${guid}`;

    return get({url: url})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export { getCategoryHistoryInfo };