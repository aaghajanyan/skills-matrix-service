import {SMConfig} from 'src/config';
import {get, post, put, del} from './client';

const getSkillsData = async () => {
    return get({url: `${SMConfig.apiEndpoints.skills}`})
        .then(result => result.data);
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

const addNewSkillData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.addSkills,
        data: data
    };
    return await post(options);
};

const collectAddedSkillData = (res) => {
    if (res.status === 201) {
        const addedSkill = {
            categories: []
        };
        addedSkill.name = res.data.name;
        addedSkill.icon = res.data.icon;
        addedSkill.guid = res.data.guid;
        res.data.addedCategories && res.data.addedCategories.map(catItem => {
            if (catItem.success) {
                const currentCat = {};
                currentCat.name = catItem.categoryName;
                currentCat.guid = catItem.guid;
                addedSkill.categories.push(currentCat)
            }
        });
        return addedSkill;
    }
};

export {getSkillsData, addNewSkillData, deleteSkillData, updateSkillData, collectAddedSkillData};