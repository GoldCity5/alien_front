import request from '../utils/request';

// 获取抖音账号信息
export const getDouyinProfile = (targetUrl: string) => {
  return request.get(`/douyin/profile?targetUrl=${encodeURIComponent(targetUrl)}`);
};

// 获取抖音视频列表
export const getDouyinVideos = (targetUrl: string) => {
  return request.get(`/douyin/videos?targetUrl=${encodeURIComponent(targetUrl)}`);
};
