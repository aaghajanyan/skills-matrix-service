


const skills = (state = [], action) => {
    switch(action.type) {
        case 'GET_SKILLS':
            return [...action.payload]
        case 'ADD_SKILL':
            return [...state, action.payload];
        case 'DELETE_SKILL':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default skills;