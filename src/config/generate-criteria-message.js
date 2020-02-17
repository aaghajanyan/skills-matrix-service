import * as util from 'util';
import messages from 'src/config/messages';

// const getCriteriaMessage = (apiType, status, criteriaName) => {
//     let obj = messages.criteria[apiType];
//     let objByStatus = obj[status];
//     switch(apiType) {
//         case 'get':
//             return filterGetMessage(objByStatus, status, criteriaName)
//         case 'add':
//             return filterAddMessage(objByStatus, status, criteriaName)
//         case 'update':
//             return filterUpdateMessage(objByStatus, status, criteriaName)
//         case 'delete':
//             return filterDeleteMessage(objByStatus, status, criteriaName)
//     }
// }

const getActionMessage = (type, criteriaName) => {
    let obj = messages.criteria.get;
    let objByStatus = obj[type];
    const newObj = Object.create(objByStatus);
    switch(type) {
        case 'error':
            newObj.description = util.format(newObj.description, criteriaName);
            return newObj;
    }
}

const addActionMessage = (type, criteriaName) => {
    let obj = messages.criteria.add;
    let objByStatus = obj[type];
    const newObj = Object.create(objByStatus);
    switch(type) {
        case 'success':
            newObj.message = util.format(newObj.message, criteriaName);
            return newObj;
        case 'error':
            newObj.description = util.format(newObj.description, criteriaName);
            return newObj;
        case 'missing':
            return newObj;
    }
}

const updateActionMessage = (type, criteriaName) => {
    let obj = messages.criteria.update;
    let objByStatus = obj[type];
    const newObj = Object.create(objByStatus);

    switch(type) {
        case 'success':
            newObj.message = util.format(newObj.message, criteriaName);
            return newObj;
        case 'error':
            newObj.description = util.format(newObj.description, criteriaName);
            return newObj;
    }
}

const deleteActionMessage = (type, criteriaName) => {
    let obj = messages.criteria.delete;
    let objByStatus = obj[type];
    const newObj = Object.create(objByStatus);

    switch(type) {
        case 'success':
            newObj.message = util.format(newObj.message, criteriaName);
            return newObj;
        case 'error':
            newObj.description = util.format(newObj.description, criteriaName);
            return newObj;
    }
}

export {getActionMessage, addActionMessage, updateActionMessage, deleteActionMessage};