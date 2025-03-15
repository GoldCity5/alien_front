import request from '../utils/request';
import { handleSSEStream } from '../utils/sseUtils';

// 获取媒体档案列表
export const getMediaProfiles = () => {
  return request.get('/media-profiles');
};

// 创建新的媒体档案 - 基本信息
export const createMediaProfileBasic = (data: {
  nickname: string;
  age: number;
  occupation: string;
  personalityTraits: string;
  educationBackground: string;
  mediaPlat: string;
}) => {
  return request.post('/media-profiles/basic', data);
};

// 更新媒体档案 - 基本信息
export const updateMediaProfileBasic = (id: string, data: {
  nickname: string;
  age: number;
  occupation: string;
  personalityTraits: string;
  educationBackground: string;
  mediaPlat: string;
}) => {
  return request.put(`/media-profiles/${id}/basic`, data);
};

// 更新媒体档案 - 经历信息
export const updateMediaProfileExperience = (id: string, data: {
  careerExperience: string;
  specialExperience: string;
  uniqueExperience: string;
  interests?: string;
}) => {
  return request.put(`/media-profiles/${id}/experience`, data);
};

// 更新媒体档案 - 目标信息
export const updateMediaProfileGoals = (id: string, data: {
  targetTrack: string;
  targetAudience: string;
  contentCreationAbility: string;
  accountPurpose: string;
  shortTermGoals: string;
  benchmarkAccounts: string;
}) => {
  return request.put(`/media-profiles/${id}/goals`, data);
};

// 获取媒体档案详情
export const getMediaProfileDetail = (id: string) => {
  return request.get(`/media-profiles/${id}`);
};

// 生成媒体策划方案
export const generateMediaPlan = (id: string) => {
  return request.post(`/media-profiles/${id}/generate-plan`, {}, {
    responseType: 'stream'
  });
};

// 生成媒体策划方案 (SSE 流式处理)
export const generateMediaPlanWithSSE = (options: {
  id: string;
  onMessage: (content: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
  onStart?: () => void;
}) => {
  const { id, onMessage, onError, onDone, onStart } = options;
  
  return handleSSEStream({
    url: `${request.defaults.baseURL}/media-profiles/${id}/generate-plan`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    },
    onMessage,
    onError,
    onDone,
    onStart
  });
};

// 保存媒体策划方案
export const saveMediaPlan = (id: string, mediaPlan: string) => {
  return request.post(`/media-profiles/${id}/save-plan`, { mediaPlan });
};

// 删除媒体档案
export const deleteMediaProfile = (id: string) => {
  return request.delete(`/media-profiles/${id}`);
};
