import React, { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button, Card, Space, Spin, Alert, message } from 'antd';
import { currentConfig } from '../config/config';
import './GenerationPages.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ScriptGenerationPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 清理函数，确保在组件卸载或重新请求时关闭之前的连接
  const cleanupEventSource = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupEventSource();
    };
  }, []);

  const handleGenerate = () => {
    if (!inputText.trim()) {
      message.warning('请输入需要生成的剧本主题');
      return;
    }

    setIsLoading(true);
    setOutputText('');
    setError(null);
    
    // 清理之前的连接
    cleanupEventSource();

    // 创建请求体
    const requestBody = JSON.stringify({ topic: inputText });
    
    // 获取token
    const token = localStorage.getItem('token');
    
    // 创建URL
    const url = `${currentConfig.apiBaseUrl}/script/generate/stream`;
    
    // 创建POST请求的控制器
    const fetchController = new AbortController();
    abortControllerRef.current = fetchController;
    
    // 发送POST请求获取SSE连接
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: requestBody,
      signal: fetchController.signal
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 使用响应的正文作为SSE流
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      // 处理SSE流
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              setIsLoading(false);
              message.success('剧本生成完成');
              break;
            }
            
            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            // 处理每一行数据，每行都是一个完整的JSON
            for (let i = 0; i < lines.length; i++) {
              try {
                const line = lines[i].trim();
                if (!line) continue;
                
                // 解析JSON格式的SSE消息
                const event = JSON.parse(line);
                
                // 根据事件类型处理
                if (event.type === 'message') {
                  // 直接添加消息内容到输出
                  setOutputText(prev => prev + (event.content || ''));
                } else if (event.type === 'error') {
                  console.error('处理SSE流时出错:', event.content);
                  setError('处理过程中出现错误: ' + (event.content || ''));
                  setIsLoading(false);
                  break;
                } else if (event.type === 'done') {
                  setIsLoading(false);
                  message.success('剧本生成完成');
                  break;
                }
              } catch (parseError) {
                console.error('解析SSE JSON数据出错:', parseError, '原始数据:', lines[i]);
                // 继续处理下一行，不中断整个流程
              }
            }
          }
        } catch (error) {
          console.error('处理SSE流时出错:', error);
          setError('处理过程中出现错误');
          setIsLoading(false);
        }
      };
      
      processStream();
      
      return () => {
        // 如果需要取消，可以在这里处理
        reader.cancel();
      };
    })
    .catch(error => {
      console.error('请求错误:', error);
      setError(error.message || '请求失败，请稍后重试');
      setIsLoading(false);
    });
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title>剧本生成</Title>
          <Paragraph style={{ fontSize: '18px' }}>
            使用AI助手生成高质量的剧本内容，适用于视频、直播、演讲等多种场景
          </Paragraph>
        </div>

        <Card title="剧本生成" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>输入主题</Text>
              <TextArea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入需要生成的剧本主题"
                style={{ marginTop: '8px', width: '100%' }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                onClick={handleGenerate} 
                loading={isLoading}
                disabled={!inputText.trim()}
              >
                生成剧本
              </Button>
            </div>
            
            <div style={{ width: '100%' }}>
              <Text strong>生成结果</Text>
              <div 
                style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  minHeight: '300px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  backgroundColor: '#fafafa',
                  position: 'relative',
                  width: '100%',
                  boxSizing: 'border-box',
                  overflowWrap: 'break-word'
                }}
              >
                {isLoading && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spin tip="生成中..." />
                  </div>
                )}
                {outputText && (
                  <div className="typing-output output-container">
                    {outputText}
                  </div>
                )}
                {!outputText && !isLoading && !error && (
                  <div className="output-container output-placeholder">
                    生成的剧本将显示在这里...
                  </div>
                )}
                {error && (
                  <Alert
                    message="错误"
                    description={error}
                    type="error"
                    showIcon
                  />
                )}
              </div>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default ScriptGenerationPage;
