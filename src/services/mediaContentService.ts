import request from '../utils/request';
import { handleSSEStream } from '../utils/sseUtils';

interface MediaContentGenerateParams {
  platform: string;
  contentTopic: string;
  keywords: string;
  contentStyle: string;
  duration: number;
}

export interface MediaContentDTO {
  id: number;
  userId: number;
  platform: string;
  contentTopic: string;
  keywords: string;
  contentStyle: string;
  duration: number;
  content: string;
  mediaProfileId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取自媒体内容文案列表
 */
export const getMediaContentList = (): Promise<MediaContentDTO[]> => {
  return request.get<ApiResponse<MediaContentDTO[]>>('/media-content/list')
    .then(response => {
      // 检查响应是否符合预期结构
      if (response.data.code === 0 && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // 如果响应不符合预期，抛出错误
      throw new Error('获取内容列表失败: ' + response.data.message);
    });
};

/**
 * 生成自媒体内容文案 (SSE 流式处理)
 */
export const generateMediaContentWithSSE = (
  params: MediaContentGenerateParams,
  options: {
    onMessage: (content: string) => void;
    onError?: (error: string) => void;
    onDone?: () => void;
    onStart?: () => void;
  }
) => {
  const { onMessage, onError, onDone, onStart } = options;
  
  return handleSSEStream({
    url: `${request.defaults.baseURL}/media-content/generate`,
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
