import * as axiosHelper from './axiosHelper';


const get = async (options) => {
    return await axiosHelper.apiClient('GET', options);
};

const put = async (options) => {
    return await axiosHelper.apiClient('PUT', options);
};

const post = async (options) => {
    return await axiosHelper.apiClient('POST', options);
};

const del = async (options) => {
    return await axiosHelper.apiClient('DELETE', options);
};

const head = async (options) => {
    return await axiosHelper.apiClient('HEAD', options);
};

export {get , post, head, put, del};