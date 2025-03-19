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

// 获取记录列表
export const getRecordList = (params: { current: number; size: number; }) => {
  return request.get('/admin/record/list', { params });
};

// 获取记录详情
export const getRecordDetail = (id: number) => {
  return request.get('/admin/record/detail', { params: { id } });
};
