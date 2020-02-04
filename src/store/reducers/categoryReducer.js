const categories = (state = [], action) => {
    switch(action.type) {
        case 'ADD_CATEGORY':
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