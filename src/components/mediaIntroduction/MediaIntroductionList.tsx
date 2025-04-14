import React, { useState, useEffect } from 'react';
import { 
  List, 
  Card, 
  Tag, 
  Button, 
  message, 
  Empty, 
  Spin, 
  Typography,
  Modal,
  Space,
  Tooltip
} from 'antd';
import { 
  CopyOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getMediaIntroductionList, MediaIntroductionDTO } from '../../services/mediaIntroductionService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './mediaIntroduction.css';

const { Text, Paragraph } = Typography;

// 平台标签颜色映射
const PLATFORM_COLORS: Record<string, string> = {
  '抖音': 'magenta',
  '快手': 'orange',
  '小红书': 'red',
  'B站': 'blue',
  '视频号': 'green',
};

const MediaIntroductionList: React.FC = () => {
  const [introductions, setIntroductions] = useState<MediaIntroductionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentIntroduction, setCurrentIntroduction] = useState<MediaIntroductionDTO | null>(null);
  const [copied, setCopied] = useState(false);

  // 获取简介列表
  const fetchIntroductions = async () => {
    setLoading(true);
    console.log('开始获取自媒体简介列表');
    try {
      const data = await getMediaIntroductionList();
      console.log('获取到自媒体简介列表数据:', data);
      // 按创建时间倒序排列，最新的排在最前面
      const sortedData = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setIntroductions(sortedData);
    } catch (error) {
      console.error('获取简介列表失败:', error);
      message.error('获取简介列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('MediaIntroductionList组件已挂载，准备获取数据');
    fetchIntroductions();
  }, []);

  // 查看简介详情
  const handleViewIntroduction = (introduction: MediaIntroductionDTO) => {
    setCurrentIntroduction(introduction);
    setViewModalVisible(true);
    setCopied(false);
  };

  // 复制简介内容
  const handleCopyIntroduction = (introduction: MediaIntroductionDTO) => {
    navigator.clipboard.writeText(introduction.content)
      .then(() => {
        message.success('简介已复制到剪贴板');
        setCopied(true);
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 删除简介 (这里只是一个示例，实际需要调用后端API)
  const handleDeleteIntroduction = (id: number) => {
    // 这里应该调用删除API
    message.success('简介删除成功');
    // 更新列表
    setIntroductions(introductions.filter(item => item.id !== id));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 截断文本
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 添加装饰性元素
  const decorativeElements = (
    <>
      <div className="decorative-circle1"></div>
      <div className="decorative-circle2"></div>
    </>
  );

  return (
    <div>
      {decorativeElements}
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p className="loading-message">加载中...</p>
        </div>
      ) : introductions.length === 0 ? (
        <Empty 
          description="暂无简介记录" 
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
          dataSource={introductions}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                className="introduction-card"
                actions={[
                  <Tooltip title="查看详情">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleViewIntroduction(item)}
                    />
                  </Tooltip>,
                  <Tooltip title="复制内容">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      onClick={() => handleCopyIntroduction(item)}
                    />
                  </Tooltip>,
                  <Tooltip title="删除">
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteIntroduction(item.id)}
                    />
                  </Tooltip>
                ]}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Tag color={PLATFORM_COLORS[item.platform] || 'default'}>
                    {item.platform}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                    {formatDate(item.createdAt)}
                  </Text>
                </div>
                <Paragraph 
                  ellipsis={{ rows: 3 }} 
                  style={{ marginBottom: '8px', fontSize: '14px' }}
                >
                  {truncateText(item.accountDescription, 120)}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* 查看简介详情的弹窗 */}
      <Modal
        title={
          <Space>
            <span>简介详情</span>
            {currentIntroduction && (
              <Tag color={PLATFORM_COLORS[currentIntroduction.platform] || 'default'}>
                {currentIntroduction.platform}
              </Tag>
            )}
          </Space>
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
            icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
            onClick={() => currentIntroduction && handleCopyIntroduction(currentIntroduction)}
            className={copied ? "copied-btn" : ""}
          >
            {copied ? '已复制' : '复制内容'}
          </Button>
        ]}
        width={700}
        className="introduction-detail-modal"
      >
        {currentIntroduction && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>账号描述：</Text>
              <Paragraph style={{ marginTop: '8px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                {currentIntroduction.accountDescription}
              </Paragraph>
            </div>
            
            <div>
              <Text strong>生成的简介：</Text>
              <div className="result-container">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
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
                  {currentIntroduction.content}
                </ReactMarkdown>
              </div>
            </div>
            
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                创建时间：{formatDate(currentIntroduction.createdAt)}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaIntroductionList;
