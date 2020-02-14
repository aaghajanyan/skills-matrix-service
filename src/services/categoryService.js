import {SMConfig} from 'src/config';
import {get, post, put, del} from './client';


const getCategoriesData = async () => {
    return get({url: `${SMConfig.apiEndpoints.categories}`})
        .then(result => result.data);
};

const addNewCategoryData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.addCategories,
        data: data
    };
    return await post(options);
};


const updateCategoryData = async (data, guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.categories}/${guid}`,
        data: data
    };
    return await put(options);
};

const deleteCategoryData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.addCategories}/${guid}`
    };
    return del(options);
};

export {getCategoriesData, addNewCategoryData, updateCategoryData, deleteCategoryData};