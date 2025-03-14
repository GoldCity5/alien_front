import axios from 'axios';
import { message } from 'antd';
import { currentConfig } from '../config/config';

const request = axios.create({
    baseURL: currentConfig.apiBaseUrl,
    timeout: 1000000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                case 401:
                    message.error('登录已过期，请重新登录');
                    // 检查是否为管理员用户
                    const isAdmin = localStorage.getItem('isAdmin') === 'true';
                    console.log('响应拦截器检测到未授权:', { isAdmin });
                    
                    // 清除登录信息
                    localStorage.removeItem('token');
                    
                    if (isAdmin) {
                        localStorage.removeItem('isAdmin');
                        localStorage.removeItem('adminNickname');
                        window.location.href = '/admin/login';
                    } else {
                        window.location.href = '/login';
                    }
                    break;
                default:
                    message.error(error.response.data?.message || '请求失败');
            }
        } else {
            message.error('网络错误，请稍后重试');
        }
        return Promise.reject(error);
    }
);

export default request;