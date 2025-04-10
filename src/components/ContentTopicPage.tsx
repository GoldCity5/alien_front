import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Spin, message, Typography, Row, Col, Table, Tag, Space, Modal } from 'antd';
import { generateContentTopicWithSSE, getContentTopicList, ContentTopicDTO } from '../services/contentTopicService';
import ReactMarkdown from 'react-markdown';
import { PlusOutlined, HistoryOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

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
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // 获取内容选题列表
  const fetchContentTopics = async () => {
    try {
      setLoadingList(true);
      const data = await getContentTopicList();
      setContentTopics(data);
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

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px - 69px)'
    }}>
      <Title level={2}>自媒体内容选题</Title>
      
      <div style={{ marginBottom: '20px' }}>
        <Space>
          <Button 
            type={activeTab === 'create' ? 'primary' : 'default'} 
            icon={<PlusOutlined />}
            onClick={() => setActiveTab('create')}
          >
            创建新选题
          </Button>
          <Button 
            type={activeTab === 'history' ? 'primary' : 'default'} 
            icon={<HistoryOutlined />}
            onClick={() => {
              setActiveTab('history');
              fetchContentTopics(); // 切换到历史选项卡时重新获取数据
            }}
          >
            历史选题
          </Button>
        </Space>
      </div>
      
      {activeTab === 'create' ? (
        <Row gutter={24}>
          {/* 左侧输入区域 */}
          <Col xs={24} md={10}>
            <Card title="输入信息" style={{ marginBottom: '20px' }}>
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
                  />
                </Form.Item>
                
                <Form.Item
                  name="platform"
                  label="平台选择"
                  rules={[{ required: true, message: '请选择平台' }]}
                >
                  <Select placeholder="请选择平台">
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
                  >
                    生成内容选题建议
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          
          {/* 右侧输出区域 */}
          <Col xs={24} md={14}>
            <Card 
              title="内容选题建议" 
              style={{ minHeight: '500px' }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin tip="正在为您生成内容选题建议..." />
                  <Paragraph style={{ marginTop: '20px' }}>
                    请耐心等待，我们正在为您精心打造...
                  </Paragraph>
                  {topicContent && (
                    <div 
                      style={{ 
                        padding: '10px',
                        lineHeight: '1.6',
                        fontSize: '14px',
                        textAlign: 'left',
                        marginTop: '20px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        background: '#fafafa'
                      }}
                    >
                      <ReactMarkdown>{topicContent}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : topicContent ? (
                <div 
                  style={{ 
                    padding: '10px',
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}
                >
                  <ReactMarkdown>{topicContent}</ReactMarkdown>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                  <p>填写左侧表单并点击"生成内容选题建议"按钮，获取专业的内容选题建议</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      ) : (
        <Card title="历史内容选题" style={{ marginBottom: '20px' }}>
          <Table 
            columns={columns} 
            dataSource={contentTopics.map(item => ({ ...item, key: item.id }))} 
            loading={loadingList}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
      
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
            <Card title="内容选题建议" style={{ maxHeight: '500px', overflow: 'auto' }}>
              {selectedTopic.content ? (
                <ReactMarkdown>{selectedTopic.content}</ReactMarkdown>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <p>暂无内容</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentTopicPage;
