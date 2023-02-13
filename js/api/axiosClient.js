import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',   // MUST BE(post, put, patch): it means params in 'body' part or 'payload' request headers are JSON before sending to server
  }
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log('request interceptors: ', config);

  // Attach token to request if exists
  // vi du ung dung su dung JWT, luu o localStorage thi can cai dat nhu duoi, luu Cookie thi ko can
  // Refresh token (maybe)
  // (.../private/posts , .../public/posts)
  const accessToken = localStorage.getItem('access_token');
  // if (privateRequest && accessToken) {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data; // get only data from response
}, function (error) {
  console.log('axiosClient - response error ', error.response);
  if (!error.response) throw new Error('Network error. Please try it later!');

  // redirect to login if not login
  if (error.response.status === 401) {
    // clear token, logout
    // ...
    window.location.assign('/login.html');
    return;
  }

  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default axiosClient;