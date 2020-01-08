import axios from "axios";
import { serverUrl } from 'config/config'
import cookie from 'react-cookies'
import { authTokenKey } from 'constants'

const getAuthHeader = () => {
  const authToken = cookie.load(authTokenKey);
  if (authToken) {
    return { Authorization: `Bearer ${cookie.load(authTokenKey)}` }
  }
  return null
}

const handleSuccess = (response) => {
  return response;
};

const handleError = (error) => {
  return Promise.reject(error);
};

const defaultHeaderHandler = request => {
  const authHeader = getAuthHeader()
  if (authHeader) {
    request.headers = authHeader
  }
  return request;
}

const service = axios.create({
  baseURL: serverUrl
});

service.interceptors.response.use(handleSuccess, handleError);
service.interceptors.request.use(defaultHeaderHandler);

const apiClient = (method, options) => {
  return service.request({
    ...options,
    method,
  })
    .then((response) => response);
};

export { apiClient };