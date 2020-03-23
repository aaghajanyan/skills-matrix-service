const categories = (state = [], action) => {
    switch(action && action.type) {
        case 'ADD_CATEGORIES':
            return [...action.payload]
        case 'UPDATE_CATEGORY':
            return [...state, action.payload];
        case 'DELETE_CATEGORY':
            return state.filter(item => item.name !== action.payload)
        default:
            return state;
    }
}

export default categories;