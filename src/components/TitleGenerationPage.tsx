import React, { useState, useEffect, useRef } from 'react';
import { Typography, Input, Button, Card, Space, Spin, Alert, message } from 'antd';
import { currentConfig } from '../config/config';
import './GenerationPages.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;


const TitleGenerationPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 清理函数，确保在组件卸载或重新请求时关闭之前的连接
  const cleanupConnection = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupConnection();
    };
  }, []);

  // 处理SSE流数据
  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // 解码并添加到缓冲区
        buffer += decoder.decode(value, { stream: true });
        
        // 处理缓冲区中的每一行
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 最后一行可能不完整，保留到下一次处理
        
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
              message.success('标题生成完成');
              break;
            }
          } catch (parseError) {
            console.error('解析SSE JSON数据出错:', parseError, '原始数据:', lines[i]);
            // 继续处理下一行，不中断整个流程
          }
        }
      }
    } catch (error) {
      console.error('Stream processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      message.warning('请输入内容');
      return;
    }

    // 清理之前的状态和连接
    cleanupConnection();
    setOutputText('');
    setError(null);
    setIsLoading(true);

    const url = `${currentConfig.apiBaseUrl}/title/generate/stream`;
    const token = localStorage.getItem('token');
    const requestBody = JSON.stringify({ content: inputText.trim() });

    // 创建新的AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: requestBody,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      processStream(reader);
    } catch (err) {
      console.error('Error generating title:', err);
      setIsLoading(false);
    }
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
          <Title>爆款标题生成</Title>
          <Paragraph style={{ fontSize: '18px' }}>
            使用AI助手生成吸引人的爆款标题，提高内容点击率和转化率
          </Paragraph>
        </div>

        <Card title="爆款标题生成" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>输入关键词</Text>
              <TextArea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入产品或内容关键词，例如：减肥产品、护肤品、学习课程..."
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
                生成爆款标题
              </Button>
            </div>
            
            <div style={{ width: '100%' }}>
              <Text strong>生成结果</Text>
              <div 
                style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  minHeight: '150px',
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
                    生成的标题将显示在这里...
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

export default TitleGenerationPage;
