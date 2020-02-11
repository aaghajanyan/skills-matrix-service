import {getCategoriesData} from 'src/services/categoryService';

const addCategory = async () => {
    try {
        const categoriesRes = await getCategoriesData();
        return {
            type: 'ADD_CATEGORIES',
            payload: categoriesRes
        }
    } catch(error){
        console.log("Error to get Skills. ", error);
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
