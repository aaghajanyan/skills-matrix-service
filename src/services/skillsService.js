import {SMConfig} from 'src/config';
import {get, post, del} from './client';


const getSkillsData = async () => {
    return get({url: `${SMConfig.apiEndpoints.skills}`})
        .then(result => result.data);
};

const addNewSkillData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.addSkills,
        data: data
    };
    return post(options);
};

const deleteSkillData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.addSkills}/${guid}`
    };
    return del(options);
};

export {getSkillsData, addNewSkillData, deleteSkillData};