import {getSkillsData, addNewSkillData, deleteSkillData, updateSkillData, collectAddedSkillData} from 'src/services/skillsService';
import {SMConfig} from 'src/config';

const addSkill = async () => {
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
            : errorObj.message = SMConfig.messages.skills.getSkill.error
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
            : errorObj.message = SMConfig.messages.skills.addSkill.error
        return errorObj;
    }
}

const updateSkillItemInStoreObj = (currentValues, categoriesObj, editedItem, state) => {
    const newState = state;
    const foundUpdatedIndex = newState.findIndex(item => item.name == editedItem.name);
    newState[foundUpdatedIndex] = {
        name: currentValues.skillName,
        icon: currentValues.iconName,
        guid: newState[foundUpdatedIndex].guid,
        categories: categoriesObj
    };
    return newState;
};

const updateSkill = async (data, editedItem, currentValues, categoriesObj, state) => {
    try {
        const updatedState = updateSkillItemInStoreObj(currentValues, categoriesObj, editedItem, state);
        await updateSkillData(data, editedItem.guid);
        return {
            type: 'UPDATE_SKILL',
            payload: updatedState,
            message: SMConfig.messages.skills.updateSkill.success
        }
    } catch(error){
        const errorObj = {
            type: 'ERROR',
        }
        error.message === 'Network Error'
            ? errorObj.message = SMConfig.messages.noConnection
            : errorObj.message = SMConfig.messages.skills.updateSkill.error
        return errorObj;
    }

}

const deleteSkill = (guids, remainingRows) => {
    try {
        guids.map(selectedEl => {deleteSkillData(selectedEl).then(() => {})});
        return {
            type: 'DELETE_SKILL',
            payload: remainingRows
        }
    } catch(error){
        const errorObj = {
            type: 'ERROR',
        }
        error.message === 'Network Error'
            ? errorObj.message = SMConfig.messages.noConnection
            : errorObj.message = SMConfig.messages.skills.deleteSkill.error
        return errorObj;
    }

}

export {
    addSkill,
    addNewSkill,
    updateSkill,
    deleteSkill
}
