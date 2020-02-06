const skills = (state = [], action) => {
    switch(action.type) {
        case 'ADD_SKILLS':
            return [...action.payload]
        case 'ADD_NEW_SKILL':
            return [...state, action.payload];
        case 'UPDATE_SKILL':
            return [...action.payload]
        case 'DELETE_SKILL':
            return [...action.payload]
            // return state.filter(item => item.name !== action.payload)
            // return {
            //     ...state,
            //     ...action.payload
            // }
        default:
            return state;
    }
}

export default skills;