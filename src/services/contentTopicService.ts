import request from '../utils/request';
import { handleSSEStream } from '../utils/sseUtils';

// 内容选题DTO接口
export interface ContentTopicDTO {
  id: number;
  userId: number;
  contentDirection: string;
  targetAudience: string;
  platform: string;
  content: string | null;
  mediaProfileId: number | null;
  createdAt: string;
  updatedAt: string;
}

// API响应接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取内容选题列表
export const getContentTopicList = async (): Promise<ContentTopicDTO[]> => {
  try {
    const response = await request.get<ApiResponse<ContentTopicDTO[]>>('/content-topics/list');
    return response.data.data; // 返回data字段中的数据
  } catch (error) {
    console.error('获取内容选题列表失败:', error);
    throw error;
  }
};

// 生成内容选题建议 (SSE 流式处理)
export const generateContentTopicWithSSE = (options: {
  contentDirection: string;
  targetAudience: string;
  platform: string;
  onMessage: (content: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
  onStart?: () => void;
}) => {
  const { 
    contentDirection, 
    targetAudience, 
    platform, 
    onMessage, 
    onError, 
    onDone, 
    onStart 
  } = options;
  
  return handleSSEStream({
    url: `${request.defaults.baseURL}/content-topics/generate`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    },
    body: {
      contentDirection,
      targetAudience,
      platform
    },
    onMessage,
    onError,
    onDone,
    onStart
  });
};
