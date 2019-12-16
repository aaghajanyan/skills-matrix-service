import axios from "axios";
import { authService } from './AuthService';

const handleSuccess = (response) => {
	return response;
};

const handleError = (error) => {
	return Promise.reject(error);
};

const defaultHeaderHandler = request => {
  request.headers = authService.getAuthHeader()
  return request;
}

const service = axios.create({});

service.interceptors.response.use(handleSuccess, handleError);
service.interceptors.request.use(defaultHeaderHandler);

const apiClient = (method, options) => {
  return service.request({
  ...options,
  method,
  })
  .then((response) => response);
};

export {apiClient} ;