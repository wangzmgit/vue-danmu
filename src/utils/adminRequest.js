import axios from 'axios';
import Cookies from 'js-cookie';

const AdminURL = "http://localhost:9000/api/";
export const CarouselUrl = AdminURL + "v1/admin/carousel/upload/img"

const service = axios.create({
    baseURL: AdminURL,
    timeout: 5000,
    headers: {},
});

service.interceptors.request.use((config) => {
    Object.assign(config.headers, { Authorization: `Bearer ${Cookies.get('admin')}` });
    return config;
}), (error) => {
    return Promise.reject(error);
}

export default service;