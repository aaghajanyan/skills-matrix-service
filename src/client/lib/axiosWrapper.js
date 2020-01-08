const axiosHelper = require('./axiosHelper');

const get = (options) => {
  return axiosHelper.apiClient('GET', options);
};

const put = (options) => {
  return axiosHelper.apiClient('PUT', options);
};

const post = (options) => {
  return axiosHelper.apiClient('POST', options);
};

const del = (options) => {
  return axiosHelper.apiClient('DELETE', options);
};

const head = (options) => {
  return axiosHelper.apiClient('HEAD', options);
};

module.exports = { get, put, post, del, head };