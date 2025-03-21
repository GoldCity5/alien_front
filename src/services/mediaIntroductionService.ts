import request from '../utils/request';
import { handleSSEStream } from '../utils/sseUtils';

interface MediaIntroductionGenerateParams {
  platform: string;
  accountDescription: string;
}

export interface MediaIntroductionDTO {
  id: number;
  userId: number;
  platform: string;
  accountDescription: string;
  content: string;
  mediaProfileId: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取自媒体简介列表
 */
export const getMediaIntroductionList = (): Promise<MediaIntroductionDTO[]> => {
  return request.get('/media-introduction/list')
    .then(response => {
      // 检查响应是否符合预期结构
      if (response.data.code === 0 && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // 如果响应不符合预期，抛出错误
      throw new Error('获取简介列表失败: ' + response.data.message);
    });
};

/**
 * 生成自媒体简介 (SSE 流式处理)
 */
export const generateMediaIntroductionWithSSE = (
  params: MediaIntroductionGenerateParams,
  options: {
    onMessage: (content: string) => void;
    onError?: (error: string) => void;
    onDone?: () => void;
    onStart?: () => void;
  }
) => {
  const { onMessage, onError, onDone, onStart } = options;
  
  return handleSSEStream({
    url: `${request.defaults.baseURL}/media-introduction/generate`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    },
    body: params,
    onMessage,
    onError,
    onDone,
    onStart
  });
};
