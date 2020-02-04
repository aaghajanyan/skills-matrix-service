const addCategory = (data) => {
    return {
        type: 'ADD_CATEGORY',
        payload: data
    }
}

const updateCategory = (data) => {
    return {
        type: 'UPDATE_CATEGORY',
        payload: data
    }
}

const deleteCategory = (id) => {
    return {
        type: 'DELETE_CATEGORY',
        payload: id
    }
}

export {
    addCategory,
    updateCategory,
    deleteCategory
}