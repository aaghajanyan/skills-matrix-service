import {SMConfig} from 'src/config';
import {del, put, post} from './client';

const addUserCategories = (guid, data) => {
    return post({url: `${SMConfig.apiEndpoints.users_categories}/${guid}`, data: data})
    .then(result => {
        return result.status;
    });
}

const updateUserCategories = (guid, data) => {
    return put({url: `${SMConfig.apiEndpoints.users_categories}/${guid}`,  data: data})
    .then(result => {
        return result.status;
    });
}

const deleteUserCategories = (userGuid, guid) => {
    return del({url: `${SMConfig.apiEndpoints.users_categories}/${userGuid}`, data: {categoryGuid: guid}})
    .then(result => {
        return result.status;
    });
}

export {addUserCategories, updateUserCategories, deleteUserCategories};