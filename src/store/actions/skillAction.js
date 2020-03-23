import {getSkillsData, addNewSkillData, collectAddedSkillData} from 'src/services/skillsService';
import {SMConfig} from 'src/config';

const getSkills = async () => {
    try {
        const skillsRes = await getSkillsData();
        return {
            type: 'ADD_SKILLS',
            payload: skillsRes
        }
    } catch(error) {
        const errorObj = {
            type: 'ERROR',
        }
        error.message === 'Network Error'
            ? errorObj.message = SMConfig.messages.noConnection
            : errorObj.message = SMConfig.messages.skills.message
        return errorObj;
    }
}

const addNewSkill = async ({name: skillName, icon: iconName, categoriesId: guidsList}) => {
    try {
        const response = await addNewSkillData({name: skillName, icon: iconName, categoriesId: guidsList});
        const addedSkill = collectAddedSkillData(response);
        return {
            type: 'ADD_NEW_SKILL',
            payload: addedSkill,
            message: SMConfig.messages.skills.addSkill.success
        }
    } catch(error) {
        const errorObj = {
            type: 'ERROR',
        }
        error.message === 'Network Error'
            ? errorObj.message = SMConfig.messages.noConnection
            : errorObj.message = SMConfig.messages.skills.message
        return errorObj;
    }
}

export {
    getSkills,
    addNewSkill
}
