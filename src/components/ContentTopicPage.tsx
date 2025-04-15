// 自媒体内容选题生成页面
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin, message, Table, Tag, Space, Modal, Tabs } from 'antd';
import { generateContentTopicWithSSE, getContentTopicList, ContentTopicDTO } from '../services/contentTopicService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import './contentTopic.css';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface FormValues {
  contentDirection: string;
  targetAudience: string;
  platform: string;
}

const ContentTopicPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topicContent, setTopicContent] = useState<string>('');
  const [contentTopics, setContentTopics] = useState<ContentTopicDTO[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ContentTopicDTO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // 获取内容选题列表
  const fetchContentTopics = async () => {
    try {
      setLoadingList(true);
      const data = await getContentTopicList();
      // 按创建时间倒序排列，最新的排在最前面
      const sortedData = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setContentTopics(sortedData);
    } catch (error) {
      message.error('获取内容选题列表失败');
    } finally {
      setLoadingList(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchContentTopics();
  }, []);

  // 生成内容选题建议
  const handleGenerateTopic = async (values: FormValues) => {
    setGenerating(true);
    setLoading(true);
    setTopicContent('');
    
    let finalContent = ''; // 用于存储最终的完整内容
    
    // 使用SSE工具处理流式响应
    generateContentTopicWithSSE({
      contentDirection: values.contentDirection,
      targetAudience: values.targetAudience,
      platform: values.platform,
      onStart: () => {
        console.log('开始生成内容选题建议');
      },
      onMessage: (content: string) => {
        // 确保内容实时更新到UI
        setTopicContent(prev => {
          const newContent = prev + content;
          finalContent = newContent; // 同时更新闭包外的变量
          console.log('收到新内容，当前长度:', newContent.length);
          return newContent;
        });
      },
      onError: (error: string) => {
        console.error('生成内容选题建议失败:', error);
        message.error('生成内容选题建议失败，请稍后重试');
        setLoading(false);
        setGenerating(false);
      },
      onDone: () => {
        console.log('内容选题建议生成完成，最终内容长度:', finalContent.length);
        message.success('内容选题建议生成完成');
        setLoading(false);
        setGenerating(false);
        // 刷新列表
        fetchContentTopics();
      }
    });
  };

  // 查看内容选题详情
  const handleViewTopic = (record: ContentTopicDTO) => {
    setSelectedTopic(record);
    setModalVisible(true);
  };

  // 平台标签颜色映射
  const platformColorMap: Record<string, string> = {
    douyin: 'magenta',
    kuaishou: 'green',
    xiaohongshu: 'red',
    bilibili: 'blue',
  };

  // 平台名称映射
  const platformNameMap: Record<string, string> = {
    douyin: '抖音',
    kuaishou: '快手',
    xiaohongshu: '小红书',
    bilibili: 'B站',
  };

  // 表格列定义
  const columns = [
    {
      title: '内容方向',
      dataIndex: 'contentDirection',
      key: 'contentDirection',
      ellipsis: true,
    },
    {
      title: '目标受众',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      ellipsis: true,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) => (
        <Tag color={platformColorMap[platform] || 'default'}>
          {platformNameMap[platform] || platform}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ContentTopicDTO) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewTopic(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];
  
  // 表单生成组件
  const TopicGenerationForm = () => (
    <div className="content-container">
      {/* 左侧输入区域 */}
      <div className="input-section">
        <div className="section-header">
          <h3 className="section-title">输入信息</h3>
          <div className="section-divider"></div>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerateTopic}
          initialValues={{ platform: 'douyin' }}
        >
          <Form.Item
            name="contentDirection"
            label="您想做的内容方向"
            rules={[{ required: true, message: '请输入您想做的内容方向' }]}
          >
            <TextArea 
              placeholder="例如：去全国各地旅行，分享一路所见所闻/用最简单的食材，教大家做美味的食物...写的越详细越好哦。" 
              autoSize={{ minRows: 4, maxRows: 8 }}
              className="form-input"
            />
          </Form.Item>
          
          <Form.Item
            name="targetAudience"
            label="您最想吸引的人群（目标受众）"
            rules={[{ required: true, message: '请输入您的目标受众' }]}
          >
            <TextArea 
              placeholder="例如：喜欢旅游的人、想旅游却没有时间的人" 
              autoSize={{ minRows: 2, maxRows: 4 }}
              className="form-input"
            />
          </Form.Item>
          
          <Form.Item
            name="platform"
            label="平台选择"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台" className="form-select">
              <Option value="douyin">抖音</Option>
              <Option value="kuaishou">快手</Option>
              <Option value="xiaohongshu">小红书</Option>
              <Option value="bilibili">B站</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={generating}
              block
              className="submit-btn"
            >
              生成内容选题建议
            </Button>
          </Form.Item>
        </Form>
      </div>
      
      {/* 右侧输出区域 */}
      <div className="result-section">
        <div className="section-header">
          <h3 className="section-title">内容选题建议</h3>
          <div className="section-divider"></div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p className="loading-message">正在为您生成内容选题建议，请耐心等待...</p>
            {topicContent && (
              <div className="result-container">
                <div className="result-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{topicContent}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : topicContent ? (
          <div className="result-container">
            <div className="result-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{topicContent}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="result-placeholder">
            <div className="result-placeholder-icon">🔍</div>
            <p>填写左侧表单并点击"生成内容选题建议"按钮，获取专业的内容选题建议</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="topic-container">
      {/* 添加装饰性元素 */}
      <div className="decorative-circle1"></div>
      <div className="decorative-circle2"></div>
      <div className="decorative-dots1"></div>
      <div className="decorative-dots2"></div>
      <div className="decorative-wave"></div>
      
      {/* 添加悬浮按钮 */}
      <div className="floating-action-btn">+</div>
      
      {/* 返回按钮 */}
      <div className="back-btn" onClick={() => navigate('/')}>
        <span>返回</span>
      </div>
      
      <div className="page-actions">
        {/* 这里可以添加页面级别的操作按钮 */}
      </div>
      
      <Tabs defaultActiveKey="create" type="card" className="topic-tabs">
        <TabPane tab="创建新选题" key="create">
          <div className="page-header">
            <h2 className="page-title">自媒体内容选题生成</h2>
          </div>
          <TopicGenerationForm />
        </TabPane>
        <TabPane tab="历史选题" key="history">
          <div className="page-header">
            <h2 className="page-title">历史内容选题</h2>
          </div>
          <div className="topic-list">
            <Table 
              columns={columns} 
              dataSource={contentTopics.map(item => ({ ...item, key: item.id }))} 
              loading={loadingList}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </TabPane>
      </Tabs>
      
      {/* 内容选题详情弹窗 */}
      <Modal
        title="内容选题详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        className="topic-detail-modal"
      >
        {selectedTopic && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>内容方向：</strong> {selectedTopic.contentDirection}</p>
              <p><strong>目标受众：</strong> {selectedTopic.targetAudience}</p>
              <p>
                <strong>平台：</strong> 
                <Tag color={platformColorMap[selectedTopic.platform] || 'default'}>
                  {platformNameMap[selectedTopic.platform] || selectedTopic.platform}
                </Tag>
              </p>
              <p><strong>创建时间：</strong> {new Date(selectedTopic.createdAt).toLocaleString('zh-CN')}</p>
            </div>
            <div className="topic-detail-card">
              {selectedTopic.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedTopic.content}</ReactMarkdown>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <p>暂无内容</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* 添加底部模块导航区域 */}
      <div className="bottom-modules">
        <h3 className="modules-title">更多创作工具</h3>
        <div className="modules-container">
          <div className="module-card" onClick={() => navigate('/media-introduction')}>
            <div className="module-icon">📱</div>
            <div className="module-title">去生成自媒体简介</div>
            <div className="module-desc">快速生成吸引人的账号简介，提升关注度</div>
          </div>
          
          <div className="module-card" onClick={() => navigate('/media-content')}>
            <div className="module-icon">📝</div>
            <div className="module-title">去生成自媒体文案</div>
            <div className="module-desc">一键生成高质量文案，提高内容传播力</div>
          </div>
          
          <div className="module-card" onClick={() => navigate('/media-profile')}>
            <div className="module-icon">📊</div>
            <div className="module-title">去生成专属策划方案</div>
            <div className="module-desc">量身定制自媒体成长路径，助你快速起号</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTopicPage;
