import axios from 'axios';
import cookie from 'react-cookies';
import {SMNotification} from 'src/view/components';
import {logOut} from 'src/services/authService';
import {SMConfig} from 'src/config';
import {AUTH_TOKEN} from '../authService';

const getAuthHeader = () => {
    const authToken = cookie.load(AUTH_TOKEN);
    if(authToken) {
        return {Authorization: `Bearer ${cookie.load(AUTH_TOKEN)}`};
    }
    return null;
};

const handleSuccess = (response) => {
    return response;
};

const handleError = (error) => {
    return Promise.reject(error);
};

const defaultHeaderHandler = request => {
    const authHeader = getAuthHeader();
    if(authHeader) {
        request.headers = authHeader;
    }
    return request;
};

const service = axios.create({
    baseURL: SMConfig.serverConfig.serverUrl
});

service.interceptors.response.use(handleSuccess, handleError);
service.interceptors.request.use(defaultHeaderHandler);

const apiClient = async (method, options) => {
    return service.request({
        ...options,
        method
    })
        .then((response) => response)
        .catch((error) => {
            if(error.response) {
                if(error.response.status === 401) {
                    logOut(); //TODO: Remove
                }
            } else if(error.request) {
                SMNotification('error', SMConfig.messages.noConnection);
            }
            return Promise.reject(error);
        });
};

export {apiClient};