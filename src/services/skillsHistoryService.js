import {SMConfig} from 'src/config';
import {get} from './client';

const getHistoryInfo = async (guid) => {

    const url = `${SMConfig.apiEndpoints.users_skills}${SMConfig.apiEndpoints.skills_history}/${guid}`;

    return get({url: url})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

export { getHistoryInfo };