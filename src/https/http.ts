import { AuthType } from '@/@types/auth,type';
import axios, { AxiosError, AxiosResponse } from 'axios';

class Http {
    public instance;
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:8000/',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.instance.interceptors.request.use(function (config) {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                config.headers.Authorization = 'Bearer ' + accessToken;
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        this.instance.interceptors.response.use(function (response: AxiosResponse) {
            const { url } = response.config
            if (url) {
                if ((['auth/login', 'auth/register', 'auth/refresh']).includes(url)) {
                    const data = response.data.data as AuthType
                    localStorage.setItem('access_token', data.accessToken)
                    localStorage.setItem('user', JSON.stringify(data.user))
                }

                if ('auth/logout' === url) {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('user')
                }
            }
            return response;
        }, async (errors) => {
            // const { response } = errors as AxiosError;
            // if (response?.status === 401) {
            //     // return await this.instance.post('auth/refresh'); b
            // }
            return Promise.reject(errors);
        });
    }
}

const http = new Http().instance;

export default http