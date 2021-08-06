import axios from 'axios';
import Cookies from 'js-cookie';

const URL = "http://localhost:9000/api/";
export const CoverUrl = URL + "v1/file/cover"
export const VideoUrl = URL + "v1/file/video"
export const AvatarUrl = URL + "v1/file/avatar"

const service = axios.create({
    baseURL: URL,
    timeout: 5000,
    headers: {},
});

service.interceptors.request.use((config) => {
    Object.assign(config.headers, { Authorization: `Bearer ${Cookies.get('token')}` });
    return config;
}), (error) => {
    return Promise.reject(error);
}

export default service;