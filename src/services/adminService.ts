import request from '../utils/request';

// 管理员登录
export const adminLogin = (data: { username: string; password: string }) => {
  return request.post('/admin/login', data);
};

// 获取管理员信息
export const getAdminInfo = () => {
  return request.get('/admin/info');
};

// 获取仪表盘数据
export const getDashboardData = () => {
  return request.get('/admin/dashboard');
};

// 获取用户列表
export interface UserListRequestParams {
  pageNum: number;
  pageSize: number;
  nickname?: string;
  phone?: string;
  status?: number;
}

export const getUserList = (params: UserListRequestParams) => {
  return request.get('/admin/users', { params });
};

// 更新用户状态
export interface UserStatusUpdateParams {
  userId: number;  // 修改回userId
  status: number; // 1-正常，0-禁用
}

export const updateUserStatus = (data: UserStatusUpdateParams) => {
  return request.put('/admin/users/status', data);
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
