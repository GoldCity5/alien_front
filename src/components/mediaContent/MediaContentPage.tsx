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
  InputNumber, 
  Row, 
  Col, 
  message,
  Tabs
} from 'antd';
import { generateMediaContentWithSSE } from '../../services/mediaContentService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MediaContentList from './MediaContentList';

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 平台选项
const PLATFORM_OPTIONS = ['抖音', '快手', '小红书', 'B站', '视频号'];

// 文案风格选项
const CONTENT_STYLE_OPTIONS = [
  '互动参与型', 
  '悬念反转型', 
  '幽默段子型', 
  '情感共鸣型', 
  '励志成长型', 
  '知识干货型', 
  '测评体验型', 
  '热点借势型', 
  '反模板化趋势', 
  '制造焦虑型'
];

const ContentGenerationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  // 生成文案
  const handleGenerate = async (values: any) => {
    setLoading(true);
    setGenerating(true);
    setGeneratedContent('');
    
    let finalContent = ''; // 用于存储最终的完整内容
    
    // 使用SSE工具处理流式响应
    generateMediaContentWithSSE(
      {
        platform: values.platform,
        contentTopic: values.contentTopic,
        keywords: values.keywords,
        contentStyle: values.contentStyle,
        duration: values.duration,
      },
      {
        onStart: () => {
          console.log('开始生成自媒体文案');
        },
        onMessage: (content) => {
          // 确保内容实时更新到UI
          setGeneratedContent(prev => {
            const newContent = prev + content;
            finalContent = newContent; // 同时更新闭包外的变量
            console.log('收到新内容，当前长度:', newContent.length);
            return newContent;
          });
        },
        onError: (error) => {
          console.error('生成文案失败:', error);
          message.error('生成文案失败，请稍后重试');
          setGenerating(false);
          setLoading(false);
        },
        onDone: () => {
          console.log('文案生成完成，最终内容长度:', finalContent.length);
          message.success('文案生成完成');
          setGenerating(false);
          setLoading(false);
        }
      }
    );
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
              contentStyle: '情感共鸣型',
              duration: 60
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
              name="contentTopic"
              label="内容主题"
              rules={[{ required: true, message: '请输入内容主题' }]}
            >
              <TextArea 
                placeholder="例如：徒步旅行川西，经过巍峨雪山群，秘境海子等美丽风景，一路上受伤、生病等等困难都克服了...加入细节描述，文案不仅更真实，还会会更有感染力哦。" 
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="keywords"
              label="关键词"
              rules={[{ required: true, message: '请输入关键词' }]}
            >
              <TextArea 
                placeholder="例如：挑战、希望、成长（主题为徒步旅行川西）" 
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>

            <Form.Item
              name="contentStyle"
              label="文案风格"
              rules={[{ required: true, message: '请选择文案风格' }]}
            >
              <Select placeholder="请选择文案风格">
                {CONTENT_STYLE_OPTIONS.map(style => (
                  <Option key={style} value={style}>{style}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label="文案口播时长（秒）"
              rules={[{ required: true, message: '请输入文案口播时长' }]}
              extra="时长约60秒对应200-300字"
            >
              <InputNumber 
                min={15} 
                max={300} 
                style={{ width: '100%' }} 
                placeholder="如60秒（200-300字）"
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
                生成文案
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
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: '16px' }}>
                正在生成文案，请稍候...
              </Paragraph>
            </div>
          ) : generatedContent ? (
            <div style={{ 
              padding: '16px', 
              background: '#f9f9f9', 
              borderRadius: '8px',
              minHeight: '400px'
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
              textAlign: 'center', 
              padding: '80px 0',
              color: '#999'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <Paragraph>
                填写左侧表单并点击"生成文案"按钮，查看生成结果
              </Paragraph>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const MediaContentPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>自媒体内容文案生成</Title>
        
        <Tabs defaultActiveKey="generate" type="card" size="large">
          <TabPane tab="生成文案" key="generate">
            <ContentGenerationForm />
          </TabPane>
          <TabPane tab="我的文案" key="list">
            <MediaContentList />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default MediaContentPage;
