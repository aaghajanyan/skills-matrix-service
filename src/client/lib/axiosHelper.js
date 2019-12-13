import axios from "axios";
import { authService } from './AuthService';

const handleSuccess = (response) => {
	return response;
  };

const handleError = (error) => {
	return Promise.reject(error);
};

const service = axios.create({
  headers: authService.getAuthHeader(),
  baseURL: 'http://localhost:3002'
});

service.interceptors.response.use(handleSuccess, handleError);

const apiClient = (method, options) => {
  return service.request({
  ...options,
  method,
  })
  .then((response) => response);
};

export {apiClient} ;