import React, { useState, useEffect } from 'react';
import { 
  Typography,
  Tag, 
  Button,
  Tooltip, 
  Modal, 
  Card, 
  message,
  Empty,
  List,
  Spin
} from 'antd';
import { 
  EyeOutlined, 
  CopyOutlined,
  ClockCircleOutlined,
  TagOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getMediaContentList, MediaContentDTO } from '../../services/mediaContentService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

// 平台颜色映射
const platformColorMap: Record<string, string> = {
  '抖音': 'magenta',
  '快手': 'green',
  '小红书': 'red',
  'B站': 'blue',
  '视频号': 'orange'
};

// 文案风格颜色映射
const styleColorMap: Record<string, string> = {
  '互动参与型': 'blue',
  '悬念反转型': 'purple',
  '幽默段子型': 'cyan',
  '情感共鸣型': 'pink',
  '励志成长型': 'green',
  '知识干货型': 'gold',
  '测评体验型': 'lime',
  '热点借势型': 'red',
  '反模板化趋势': 'geekblue',
  '制造焦虑型': 'volcano'
};

const MediaContentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [contentList, setContentList] = useState<MediaContentDTO[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState<MediaContentDTO | null>(null);

  // 获取内容列表
  const fetchContentList = async () => {
    try {
      setLoading(true);
      const data = await getMediaContentList();
      // 按创建时间倒序排列，最新的排在最前面
      const sortedData = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setContentList(sortedData);
    } catch (error) {
      console.error('获取内容列表失败:', error);
      message.error('获取内容列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchContentList();
  }, []);

  // 查看内容详情
  const handleViewContent = (record: MediaContentDTO) => {
    setCurrentContent(record);
    setViewModalVisible(true);
  };

  // 复制内容
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        message.success('内容已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 处理关键词显示
  const renderKeywords = (keywords: string) => {
    // 尝试按逗号分隔，如果没有逗号就当作单个关键词处理
    const keywordArray = keywords.includes(',') 
      ? keywords.split(',') 
      : [keywords];
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {keywordArray.map((keyword, index) => (
          <Tag key={index} icon={<TagOutlined />}>{keyword.trim()}</Tag>
        ))}
      </div>
    );
  };

  // 表格列定义
  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>自媒体内容文案列表</Title>
            <Button type="primary" onClick={fetchContentList}>刷新</Button>
          </div>
        }
        bordered={false}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
      >
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p className="loading-message">加载中...</p>
          </div>
        ) : contentList.length === 0 ? (
          <Empty 
            description="暂无文案记录" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
          />
        ) : (
          <List
            grid={{ 
              gutter: 16, 
              xs: 1, 
              sm: 1, 
              md: 2, 
              lg: 2, 
              xl: 3, 
              xxl: 3 
            }}
            dataSource={contentList}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  className="content-card"
                  actions={[
                    <Tooltip title="查看详情">
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />} 
                        onClick={() => handleViewContent(item)}
                      />
                    </Tooltip>,
                    <Tooltip title="复制内容">
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        onClick={() => handleCopyContent(item.content)}
                      />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => {/* handleDeleteContent(item.id) */}}
                      />
                    </Tooltip>
                  ]}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <Tag color={platformColorMap[item.platform] || 'default'}>
                      {item.platform}
                    </Tag>
                    <Tag color={styleColorMap[item.contentStyle] || 'default'}>
                      {item.contentStyle}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </div>
                  <Paragraph 
                    ellipsis={{ rows: 3 }} 
                    style={{ marginBottom: '8px', fontSize: '14px' }}
                  >
                    {item.contentTopic}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 查看内容详情的模态框 */}
      <Modal
        title={
          currentContent && (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <Tag color={platformColorMap[currentContent.platform] || 'default'}>
                  {currentContent.platform}
                </Tag>
                <Tag color={styleColorMap[currentContent.contentStyle] || 'default'}>
                  {currentContent.contentStyle}
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {currentContent.duration}秒
                </Tag>
              </div>
              <div>{currentContent.contentTopic}</div>
            </div>
          )
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="copy" 
            type="primary" 
            icon={<CopyOutlined />}
            onClick={() => currentContent && handleCopyContent(currentContent.content)}
          >
            复制内容
          </Button>,
        ]}
        width={700}
      >
        {currentContent && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>关键词：</Text>
              {renderKeywords(currentContent.keywords)}
            </div>
            <Card 
              style={{ 
                background: '#f9f9f9', 
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'auto'
              }}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Add custom styling for table elements
                  table: ({node, ...props}) => (
                    <table style={{borderCollapse: 'collapse', width: '100%', margin: '10px 0'}} {...props} />
                  ),
                  thead: ({node, ...props}) => (
                    <thead style={{backgroundColor: '#f0f0f0'}} {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}} {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}} {...props} />
                  ),
                  // Ensure all text elements are left-aligned
                  p: ({node, ...props}) => (
                    <p style={{textAlign: 'left', margin: '8px 0'}} {...props} />
                  ),
                  h1: ({node, ...props}) => (
                    <h1 style={{textAlign: 'left', margin: '16px 0 8px'}} {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 style={{textAlign: 'left', margin: '14px 0 7px'}} {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 style={{textAlign: 'left', margin: '12px 0 6px'}} {...props} />
                  ),
                  h4: ({node, ...props}) => (
                    <h4 style={{textAlign: 'left', margin: '10px 0 5px'}} {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul style={{textAlign: 'left', paddingLeft: '20px'}} {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol style={{textAlign: 'left', paddingLeft: '20px'}} {...props} />
                  )
                }}
              >
                {currentContent.content}
              </ReactMarkdown>
            </Card>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Text type="secondary">
                创建于 {dayjs(currentContent.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaContentList;
