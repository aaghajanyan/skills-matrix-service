import {SMConfig} from 'src/config';
import {get, put, del, post} from './client';


const getPositions = async () => {
    return get({url: `${SMConfig.apiEndpoints.positions}`})
        .then(result => result.data)
};

const updatePositionData = async (data, guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.positions}/${guid}`,
        data: data
    };
    return await put(options);
};

const deletePositionData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.positions}/${guid}`
    };
    return del(options);
};

const addNewPositionData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.positions,
        data: data
    };
    return await post(options);
};

export {getPositions, addNewPositionData, updatePositionData, deletePositionData};