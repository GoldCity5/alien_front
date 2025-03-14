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
        // 判断请求路径是否包含 /admin，决定使用哪个 token
        const isAdminRequest = config.url?.includes('/admin');
        const token = isAdminRequest 
            ? localStorage.getItem('adminToken') 
            : localStorage.getItem('userToken');
            
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
                    // 检查是否为管理员请求
                    const isAdminRequest = error.config.url?.includes('/admin');
                    console.log('响应拦截器检测到未授权:', { isAdminRequest });
                    
                    // 根据请求类型清除相应的登录信息
                    if (isAdminRequest) {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('adminNickname');
                        localStorage.removeItem('isAdmin');
                        message.error('管理员登录已过期，请重新登录');
                        window.location.href = '/admin/login';
                    } else {
                        localStorage.removeItem('userToken');
                        message.error('用户登录已过期，请重新登录');
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