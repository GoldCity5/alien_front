// 自媒体昵称简介生成页面
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
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
import { useNavigate } from 'react-router-dom';
import './mediaIntroduction.css'; // 引入CSS文件

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
    <div className="nickname-container">
      {/* 左侧输入区域 */}
      <div className="input-section">
        <div className="section-header">
          <h3 className="section-title">输入信息</h3>
          <div className="section-divider"></div>
        </div>
        
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
            <Select placeholder="请选择发布平台" className="form-select">
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
              className="form-input"
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
              生成简介
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
            <p className="loading-message">正在生成简介，请稍候...</p>
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
            <p>填写左侧表单并点击"生成简介"按钮开始生成</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaIntroductionPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="media-introduction-container">
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
      
      <Tabs defaultActiveKey="generate" type="card" className="introduction-tabs">
        <TabPane tab="生成简介" key="generate">
          <div className="page-header">
            <h2 className="page-title">账号昵称简介生成</h2>
          </div>
          <IntroductionGenerationForm />
        </TabPane>
        <TabPane tab="我的简介" key="list">
          <div className="page-header">
            <h2 className="page-title">我的简介列表</h2>
            <p className="page-description">
              查看和管理您已生成的所有简介内容。
            </p>
          </div>
          <div className="introduction-list">
            <MediaIntroductionList />
          </div>
        </TabPane>
      </Tabs>
      
      {/* 添加底部模块导航区域 */}
      <div className="bottom-modules">
        <h3 className="modules-title">更多创作工具</h3>
        <div className="modules-container">
          <div className="module-card" onClick={() => handleNavigate('/content-topic')}>
            <div className="module-icon">🔍</div>
            <div className="module-title">去生成内容选题</div>
            <div className="module-desc">找到最适合你的创作方向和热门话题</div>
          </div>
          
          <div className="module-card" onClick={() => handleNavigate('/media-content')}>
            <div className="module-icon">📝</div>
            <div className="module-title">去生成自媒体文案</div>
            <div className="module-desc">一键生成高质量文案，提高内容传播力</div>
          </div>
          
          <div className="module-card" onClick={() => handleNavigate('/media-profile')}>
            <div className="module-icon">📊</div>
            <div className="module-title">去生成专属策划方案</div>
            <div className="module-desc">量身定制自媒体成长路径，助你快速起号</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaIntroductionPage;
