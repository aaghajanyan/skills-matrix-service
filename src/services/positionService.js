import {SMConfig} from 'src/config';
import {get, put, del, post} from './client';


const getPositions = async () => {
    return get({url: `${SMConfig.apiEndpoints.position}`})
        .then(result => result.data)
};

const updatePositionData = async (data, guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.position}/${guid}`,
        data: data
    };
    return await put(options);
};

const deletePositionData = async (guid) => {
    const options = {
        url: `${SMConfig.apiEndpoints.position}/${guid}`
    };
    return del(options);
};

const addNewPositionData = async (data) => {
    const options = {
        url: SMConfig.apiEndpoints.position,
        data: data
    };
    return await post(options);
};

export {getPositions, addNewPositionData, updatePositionData, deletePositionData};