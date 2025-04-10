import React, { useState } from 'react';
import { Typography, Input, Button, Card, Avatar, Statistic, Row, Col, List, Image, Tag, Spin, message } from 'antd';
import { UserOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined, StarOutlined } from '@ant-design/icons';
import { getDouyinProfile, getDouyinVideos } from '../../services/douyinService';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface DouyinProfile {
  nickname: string;
  signature: string;
  follower_count: number;
  following_count: number;
  total_favorited: number;
  aweme_count: number;
  avatar_300x300: {
    url_list: string[];
  };
  ip_location: string;
}

interface VideoItem {
  id: string;
  desc: string;
  cover: string;
  digg_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  duration: number;
  text_extra: {
    tag_name: string;
  }[];
}

const DouyinAnalysisPage: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<DouyinProfile | null>(null);
  const [videosData, setVideosData] = useState<VideoItem[]>([]);

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化时长
  const formatDuration = (duration: number): string => {
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // 分析抖音账号
  const handleAnalysis = async () => {
    if (!targetUrl) {
      message.warning('请输入抖音链接');
      return;
    }

    setLoading(true);
    try {
      // 获取账号信息
      const profileResponse = await getDouyinProfile(targetUrl);
      if (profileResponse.data.code === 0) {
        setProfileData(profileResponse.data.data);
      } else {
        message.error(profileResponse.data.message || '获取账号信息失败');
      }

      // 获取视频列表
      const videosResponse = await getDouyinVideos(targetUrl);
      if (videosResponse.data.code === 0) {
        setVideosData(videosResponse.data.data || []);
      } else {
        message.error(videosResponse.data.message || '获取视频列表失败');
      }
    } catch (error) {
      console.error('分析抖音账号失败:', error);
      message.error('分析抖音账号失败，请检查链接是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 64px - 69px)' }}>
      <Title level={2}>抖音账号分析</Title>
      <Paragraph style={{ marginBottom: '20px' }}>
        输入抖音账号链接，分析账号信息和热门视频
      </Paragraph>

      <Card style={{ marginBottom: '20px' }}>
        <Search
          placeholder="请输入抖音链接，例如: https://www.douyin.com/user/MS4wLjABAAAAKjY0Z13tj4..."
          enterButton="分析账号"
          size="large"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          onSearch={handleAnalysis}
          loading={loading}
        />
      </Card>

      <Spin spinning={loading}>
        {profileData && (
          <Card title="账号信息" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <Avatar 
                size={100} 
                src={profileData.avatar_300x300?.url_list?.[0]} 
                icon={<UserOutlined />} 
              />
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ marginTop: 0, marginBottom: '8px' }}>
                  {profileData.nickname}
                  <Text type="secondary" style={{ fontSize: '14px', marginLeft: '10px' }}>
                    {profileData.ip_location}
                  </Text>
                </Title>
                <Paragraph>{profileData.signature}</Paragraph>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="粉丝数" value={profileData.follower_count} formatter={value => formatNumber(Number(value))} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="关注数" value={profileData.following_count} formatter={value => formatNumber(Number(value))} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="获赞数" value={profileData.total_favorited} formatter={value => formatNumber(Number(value))} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="作品数" value={profileData.aweme_count} formatter={value => formatNumber(Number(value))} />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        )}

        {videosData.length > 0 && (
          <Card title="视频列表">
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
              dataSource={videosData}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: '200px', overflow: 'hidden' }}>
                        <Image
                          alt={item.desc}
                          src={item.cover}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          preview={false}
                        />
                      </div>
                    }
                  >
                    <div style={{ marginBottom: '10px', height: '44px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.desc}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <Text type="secondary">时长: {formatDuration(item.duration)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <HeartOutlined style={{ marginRight: '5px' }} />
                        {formatNumber(item.digg_count)}
                      </div>
                      <div>
                        <MessageOutlined style={{ marginRight: '5px' }} />
                        {formatNumber(item.comment_count)}
                      </div>
                      <div>
                        <StarOutlined style={{ marginRight: '5px' }} />
                        {formatNumber(item.collect_count)}
                      </div>
                      <div>
                        <ShareAltOutlined style={{ marginRight: '5px' }} />
                        {formatNumber(item.share_count)}
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {item.text_extra?.slice(0, 3).map((tag, index) => (
                        <Tag key={index} color="blue">{tag.tag_name}</Tag>
                      ))}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default DouyinAnalysisPage;
