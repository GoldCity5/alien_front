 // 自媒体昵称简介生成页面
import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Spin, 
  Row, 
  Col, 
  message,
  Tabs
} from 'antd';
import { generateMediaIntroductionWithSSE } from '../../services/mediaIntroductionService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MediaIntroductionList from './MediaIntroductionList';

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 平台选项
const PLATFORM_OPTIONS = ['抖音', '快手', '小红书', 'B站', '视频号'];

const IntroductionGenerationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  // 生成简介
  const handleGenerate = async (values: any) => {
    setLoading(true);
    setGenerating(true);
    setGeneratedContent('');
    
    let finalContent = ''; // 用于存储最终的完整内容
    
    console.log('开始调用生成简介API，参数:', values);
    
    try {
      // 使用SSE工具处理流式响应
      generateMediaIntroductionWithSSE(
        {
          platform: values.platform,
          accountDescription: values.accountDescription,
        },
        {
          onStart: () => {
            console.log('开始生成自媒体简介');
          },
          onMessage: (content) => {
            console.log('收到新内容片段:', content);
            // 确保内容实时更新到UI
            setGeneratedContent(prev => {
              const newContent = prev + content;
              finalContent = newContent; // 同时更新闭包外的变量
              console.log('当前累积内容长度:', newContent.length);
              return newContent;
            });
          },
          onError: (error) => {
            console.error('生成简介失败:', error);
            message.error('生成简介失败，请稍后重试');
            setGenerating(false);
            setLoading(false);
          },
          onDone: () => {
            console.log('简介生成完成，最终内容长度:', finalContent.length);
            message.success('简介生成完成');
            setGenerating(false);
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('调用生成简介API失败:', error);
      message.error('调用生成简介API失败，请稍后重试');
      setGenerating(false);
      setLoading(false);
    }
  };

  return (
    <Row gutter={24}>
      {/* 左侧输入区域 */}
      <Col xs={24} md={12}>
        <Card 
          title="输入参数" 
          bordered={false} 
          style={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderRadius: '8px'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerate}
            initialValues={{
              platform: '抖音',
            }}
          >
            <Form.Item
              name="platform"
              label="发布平台"
              rules={[{ required: true, message: '请选择发布平台' }]}
            >
              <Select placeholder="请选择发布平台">
                {PLATFORM_OPTIONS.map(platform => (
                  <Option key={platform} value={platform}>{platform}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="accountDescription"
              label="账号描述"
              rules={[{ required: true, message: '请输入账号描述' }]}
            >
              <TextArea 
                placeholder="请简单输入您的想做的账号内容，例如：我想做一个美食账号，分享城市里好吃的美食。" 
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={generating}
                block
                size="large"
                style={{ marginTop: '16px' }}
              >
                生成简介
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      {/* 右侧输出区域 */}
      <Col xs={24} md={12}>
        <Card 
          title="生成结果" 
          bordered={false} 
          style={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderRadius: '8px'
          }}
        >
          {loading && !generatedContent ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '300px', 
              flexDirection: 'column'
            }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px' }}>正在生成简介，请稍候...</p>
            </div>
          ) : generatedContent ? (
            <div style={{ 
              padding: '16px', 
              background: '#f9f9f9', 
              borderRadius: '8px',
              minHeight: '300px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap'
            }}>
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
                {generatedContent}
              </ReactMarkdown>
              {loading && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <Spin size="small" />
                  <span style={{ marginLeft: '10px', color: '#1890ff' }}>正在生成更多内容...</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '300px', 
              color: '#999',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <p>填写左侧表单并点击"生成简介"按钮开始生成</p>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const MediaIntroductionPage: React.FC = () => {
  return (
    <Layout style={{ 
      padding: '24px', 
      background: '#f0f2f5', 
      minHeight: 'calc(100vh - 64px - 69px)'
    }}>
      <Content style={{ 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Title level={2} style={{ marginBottom: '24px' }}>自媒体简介生成</Title>
        <Paragraph style={{ marginBottom: '24px' }}>
          使用AI智能生成适合不同平台的自媒体账号简介，提升账号专业度和吸引力。
        </Paragraph>
        
        <Tabs defaultActiveKey="generate" type="card">
          <TabPane tab="生成简介" key="generate">
            <IntroductionGenerationForm />
          </TabPane>
          <TabPane tab="我的简介" key="list">
            <MediaIntroductionList />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default MediaIntroductionPage;
