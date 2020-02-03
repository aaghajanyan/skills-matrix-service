import {SMConfig} from 'src/config';
import {get, post} from './client';


const getSkillsData = async () => {
    return get({url: `${SMConfig.apiEndpoints.skills}`})
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
};

const addNewSkillData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.addSkills,
        data: data
    };
    return post(options);
};

export {getSkillsData, addNewSkillData};