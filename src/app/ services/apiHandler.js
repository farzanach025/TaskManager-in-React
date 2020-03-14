import {withRouter} from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://dev.teledirectasia.com:3092/";

export const performRequest = (method, url, params, data, login = true) => {
    const body = method === 'get' || method === 'delete' || method === 'put' || method == 'patch' ? 'params' : 'data';

    const config = {
        method,
        url,
        baseURL: API_URL,
        [body]: params || {},
    };
    if (method === 'put' || method == 'patch') {
        config.data = data
    }
    config.headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + localStorage.getItem('accessToken')
    };

    // if (login) {
    //     config.headers.Authorization = "Bearer " + localStorage.getItem('accessToken')
    // }
    return axios.request(config)
    // Add a request interceptor

};

axios.interceptors.response.use((response) => {
    return response
});
// (performRequest);
