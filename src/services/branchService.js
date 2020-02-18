import {SMConfig} from 'src/config';
import {get, put, del, post} from './client';


const getBranches = async () => {
    return get({url: `${SMConfig.apiEndpoints.branches}`})
        .then(result => result.data)
};

const updateBranchData = async (data, guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.branches}/${guid}`,
        data: data
    };
    return await put(options);
};

const deleteBranchData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.branches}/${guid}`
    };
    return del(options);
};

const addNewBranchData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.branches,
        data: data
    };
    return await post(options);
};

export {getBranches, addNewBranchData, updateBranchData, deleteBranchData};