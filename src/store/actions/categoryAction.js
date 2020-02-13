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

export {
    addCategory
}
