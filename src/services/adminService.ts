import request from '../utils/request';

// 管理员登录
export const adminLogin = (data: { username: string; password: string }) => {
  return request.post('/admin/login', data);
};

// 获取管理员信息
export const getAdminInfo = () => {
  return request.get('/admin/info');
};
