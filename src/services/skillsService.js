import {SMConfig} from 'src/config';
import {get, post, put, del} from './client';


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

const updateSkillData = async (data, guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.skills}/${guid}`,
        data: data
    };
    return put(options);
};

const deleteSkillData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.addSkills}/${guid}`
    };
    return del(options);
};

export {getSkillsData, addNewSkillData, deleteSkillData, updateSkillData};