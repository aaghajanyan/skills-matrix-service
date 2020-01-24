import axios from "axios";
import { serverUrl } from 'config/config'
import cookie from 'react-cookies'
import { authTokenKey } from 'constants'
import { logOut } from 'client/lib/authService'; //TODO: Remove

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
    .then((response) => response)
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401) {
          logOut() //TODO: Remove
        }
      }
      return Promise.reject(error)
    })
};

export { apiClient };