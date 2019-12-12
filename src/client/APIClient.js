import axios from "axios";
import { serverUrl } from "../config/config";
import { authService } from '../client/AuthService';

const CancelToken = axios.CancelToken;

class ApiService {
  constructor() {
    let service = axios.create({
      headers: authService.getAuthHeader()
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error){
    if(axios.isCancel(error)){
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }

  getPath (path) {
    return `${serverUrl}/${path}`;
  }

  apiClient(path, type, config, cancellationController) {
    return this.service.request({
      ...config,
      headers: authService.getAuthHeader(),
      method: type,
      url: this.getPath(path),
      responseType: 'json',
      cancelToken: new CancelToken(c => {
        if('function' === typeof cancellationController){
          cancellationController(c);
        }
      })
    }).then((response) => response);
  }

  get(path, params, cancellationController) {
    return this.apiClient(path, 'GET', { params }, cancellationController);
  }

  put(path, data, cancellationController) {
    return this.apiClient(path, 'PUT', { data }, cancellationController);
  }

  post(path, data, cancellationController) {
    return this.apiClient(path, 'POST', { data }, cancellationController);
  }

  delete(path, data, cancellationController) {
    return this.apiClient(path, 'DELETE', { data }, cancellationController);
  }

}

export default new ApiService();
