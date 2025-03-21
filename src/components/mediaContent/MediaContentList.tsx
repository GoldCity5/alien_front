import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Tooltip, 
  Modal, 
  Card, 
  message,
  Empty
} from 'antd';
import { 
  EyeOutlined, 
  CopyOutlined,
  ClockCircleOutlined,
  TagOutlined
} from '@ant-design/icons';
import { getMediaContentList, MediaContentDTO } from '../../services/mediaContentService';
import ReactMarkdown from 'react-markdown';
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
      setContentList(data);
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
  const columns = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      render: (platform: string) => (
        <Tag color={platformColorMap[platform] || 'default'}>
          {platform}
        </Tag>
      ),
    },
    {
      title: '内容主题',
      dataIndex: 'contentTopic',
      key: 'contentTopic',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 200,
      render: renderKeywords,
    },
    {
      title: '风格',
      dataIndex: 'contentStyle',
      key: 'contentStyle',
      width: 120,
      render: (style: string) => (
        <Tag color={styleColorMap[style] || 'default'}>
          {style}
        </Tag>
      ),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => (
        <Tag icon={<ClockCircleOutlined />} color="default">
          {duration}秒
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: MediaContentDTO) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewContent(record)}
            title="查看"
          />
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={() => handleCopyContent(record.content)}
            title="复制"
          />
        </Space>
      ),
    },
  ];

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
        {contentList.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={contentList.map(item => ({ ...item, key: item.id }))} 
            loading={loading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: '0 20px' }}>
                  <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                    {record.content}
                  </Paragraph>
                </div>
              ),
            }}
          />
        ) : (
          <Empty 
            description="暂无内容记录" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
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
              <ReactMarkdown>{currentContent.content}</ReactMarkdown>
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
