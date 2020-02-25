import {SMConfig} from 'src/config';
import {del, put, post} from './client';

const addUserSkills = (guid, data) => {
    return post({url: `${SMConfig.apiEndpoints.users_skills}/${guid}`, data: data})
    .then(result => {
        return result.status;
    })
    .catch(error => {
        console.warn('Handle error', error);
    });
}

const updateUserSkills = (guid, data) => {
    return put({url: `${SMConfig.apiEndpoints.users_skills}/${guid}`,  data: data})
    .then(result => {
        return result.status;
    })
    .catch(error => {
        console.warn('Handle error', error);
    });
}

const deleteUserSkills = (userGuid, guid) => {
    return del({url: `${SMConfig.apiEndpoints.users_skills}/${userGuid}`, data: {skillGuid: guid}})
    .then(result => {
        return result.status;
    })
    .catch(error => {
        console.warn('Handle error', error);
    });
}

export {addUserSkills, updateUserSkills, deleteUserSkills};