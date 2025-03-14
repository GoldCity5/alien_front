import request from '../utils/request';

// 管理员登录
export const adminLogin = (data: { username: string; password: string }) => {
  return request.post('/admin/login', data);
};

// 获取管理员信息
export const getAdminInfo = () => {
  return request.get('/admin/info');
};

// 获取提示词列表
export const getPromptList = (params?: any) => {
  return request.get('/admin/prompts', { params });
};

// 更新提示词
export const updatePrompt = (data: any) => {
  return request.put(`/admin/prompts/${data.id}`, data);
};
