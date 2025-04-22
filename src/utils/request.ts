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
            const status = error.response.status;
            const config = error.config;
            const isAdminRequest = config.url?.includes('/admin');
            const errorMessage = error.response.data?.message || '请求失败';

            switch (status) {
                case 401: // 未授权
                    console.log('响应拦截器检测到 401 未授权:', { isAdminRequest });
                    if (isAdminRequest) {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('adminNickname');
                        localStorage.removeItem('isAdmin');
                        message.error('管理员登录状态失效，请重新登录');
                        window.location.href = '/admin/login';
                    } else {
                        localStorage.removeItem('userToken');
                        message.error('用户登录状态失效，请重新登录');
                        window.location.href = '/login';
                    }
                    break;
                case 403: // 禁止访问
                    console.log('响应拦截器检测到 403 禁止访问:', { isAdminRequest, url: config.url });
                    // 对于 403，只提示错误，不强制跳转或清除 token
                    message.error(errorMessage || '您没有权限访问此资源');
                    break;
                default:
                    message.error(errorMessage);
            }
        } else {
            message.error('网络错误，请稍后重试');
        }
        return Promise.reject(error);
    }
);

export default request;