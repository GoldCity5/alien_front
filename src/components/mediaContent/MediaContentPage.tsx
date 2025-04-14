// 自媒体内容文案生成页面
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
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
import { useNavigate } from 'react-router-dom';
import './mediaContent.css'; // 引入CSS文件

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
    <div className="content-container">
      {/* 左侧输入区域 */}
      <div className="input-section">
        <div className="section-header">
          <h3 className="section-title">输入参数</h3>
          <div className="section-divider"></div>
        </div>
        
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
            <Select placeholder="请选择发布平台" className="form-select">
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
              className="form-input"
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
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="contentStyle"
            label="文案风格"
            rules={[{ required: true, message: '请选择文案风格' }]}
          >
            <Select placeholder="请选择文案风格" className="form-select">
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
              className="form-number-input"
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
              className="submit-btn"
            >
              生成文案
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* 右侧输出区域 */}
      <div className="result-section">
        <div className="section-header">
          <h3 className="section-title">生成结果</h3>
          <div className="section-divider"></div>
        </div>
        
        {loading && !generatedContent ? (
          <div className="loading-container">
            <Spin size="large" />
            <p className="loading-message">正在生成文案，请稍候...</p>
          </div>
        ) : generatedContent ? (
          <div className="result-container">
            <div className="result-content">
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
          </div>
        ) : (
          <div className="result-placeholder">
            <div className="result-placeholder-icon">📝</div>
            <p>填写左侧表单并点击"生成文案"按钮，查看生成结果</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaContentPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="media-content-container">
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
      
      <Tabs defaultActiveKey="generate" type="card" className="content-tabs">
        <TabPane tab="生成文案" key="generate">
          <div className="page-header">
            <h2 className="page-title">自媒体内容文案生成</h2>
          </div>
          <ContentGenerationForm />
        </TabPane>
        <TabPane tab="我的文案" key="list">
          <div className="page-header">
            <h2 className="page-title">我的文案列表</h2>
            <p className="page-description">
              查看和管理您已生成的所有文案内容。
            </p>
          </div>
          <div className="content-list">
            <MediaContentList />
          </div>
        </TabPane>
      </Tabs>
      
      {/* 添加底部模块导航区域 */}
      <div className="bottom-modules">
        <h3 className="modules-title">更多创作工具</h3>
        <div className="modules-container">
          <div className="module-card" onClick={() => navigate('/content-topic')}>
            <div className="module-icon">🔍</div>
            <div className="module-title">去生成内容选题</div>
            <div className="module-desc">找到最适合你的创作方向和热门话题</div>
          </div>
          
          <div className="module-card" onClick={() => navigate('/media-introduction')}>
            <div className="module-icon">📱</div>
            <div className="module-title">去生成自媒体简介</div>
            <div className="module-desc">快速生成吸引人的账号简介，提升关注度</div>
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

export default MediaContentPage;
