import {SMNotification} from 'src/view/components';

const skills = (state = [], action) => {
    switch(action.type) {
        case 'ADD_SKILLS':
            return [...action.payload]// ? [...action.payload] : []
        case 'ADD_NEW_SKILL':
            SMNotification('success', action.message);
            return [...state, action.payload];
        case 'UPDATE_SKILL':
            SMNotification('success', action.message);
            return [...action.payload]
        case 'DELETE_SKILL':
            return [...action.payload]
        case 'ERROR':
            SMNotification('error', action.message)
            return [...state]
        default:

            return [...state];
    }
}

export default skills;