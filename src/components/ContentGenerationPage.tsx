import React, { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button, Card, Space, Spin, Alert, message } from 'antd';
import { currentConfig } from '../config/config';
import './GenerationPages.css'; // 引入共享CSS文件
import './ContentGenerationPage.css'; // 引入特定CSS文件

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;


const ContentGenerationPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 仿写功能的状态
  const [rewriteInputText, setRewriteInputText] = useState<string>('');
  const [rewriteOutputText, setRewriteOutputText] = useState<string>('');
  const [isRewriteLoading, setIsRewriteLoading] = useState<boolean>(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const rewriteAbortControllerRef = useRef<AbortController | null>(null);

  // 生成功能的状态
  const [generateInputText, setGenerateInputText] = useState<string>('');
  const [generateOutputText, setGenerateOutputText] = useState<string>('');
  const [isGenerateLoading, setIsGenerateLoading] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const generateAbortControllerRef = useRef<AbortController | null>(null);

  // 清理函数，确保在组件卸载或重新请求时关闭之前的连接
  const cleanupEventSource = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // 清理仿写功能的连接
  const cleanupRewriteEventSource = () => {
    if (rewriteAbortControllerRef.current) {
      rewriteAbortControllerRef.current.abort();
      rewriteAbortControllerRef.current = null;
    }
  };

  // 清理生成功能的连接
  const cleanupGenerateEventSource = () => {
    if (generateAbortControllerRef.current) {
      generateAbortControllerRef.current.abort();
      generateAbortControllerRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupEventSource();
      cleanupRewriteEventSource();
      cleanupGenerateEventSource();
    };
  }, []);

  const handleOptimize = () => {
    if (!inputText.trim()) {
      message.warning('请输入需要优化的文案');
      return;
    }

    setIsLoading(true);
    setOutputText('');
    setError(null);
    
    // 清理之前的连接
    cleanupEventSource();

    // 创建请求体
    const requestBody = JSON.stringify({ content: inputText });
    
    // 获取token
    const token = localStorage.getItem('userToken');
    
    // 创建URL，包含查询参数
    const url = `${currentConfig.apiBaseUrl}/content/optimize/stream`;
    
    // 创建POST请求的EventSource
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
              message.success('文案优化完成');
              break;
            }
            
            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            // 处理每一行数据，每行都是一个完整的JSON
            for (let i = 0; i < lines.length; i++) {
              try {
                const line = lines[i].trim();
                if (!line) continue;

                if (line.startsWith('id:')) continue;
                if (line.startsWith('event:')) continue;


                let event; // 使用 let 声明变量

                // 解析JSON格式的SSE消息
                if (line.startsWith('data:')) {
                  console.log('line.slice(5)::', line.slice(5));
                  if (line.slice(5) === '') continue;
                  event = JSON.parse(line.slice(5)); // 不需要重新声明
                } else if (line.startsWith('{')) {
                  event = JSON.parse(line);
                } else {
                  continue; // 添加分号
                }
                
                
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
                  message.success('文案生成完成');
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

  const handleRewrite = () => {
    if (!rewriteInputText.trim()) {
      message.warning('请输入需要仿写的文案');
      return;
    }

    setIsRewriteLoading(true);
    setRewriteOutputText('');
    setRewriteError(null);
    
    // 清理之前的连接
    cleanupRewriteEventSource();

    // 创建请求体
    const requestBody = JSON.stringify({ content: rewriteInputText });
    
    // 获取token
    const token = localStorage.getItem('userToken');
    
    // 创建URL，包含查询参数
    const url = `${currentConfig.apiBaseUrl}/content/rewrite/stream`;
    
    // 创建POST请求的EventSource
    const fetchController = new AbortController();
    rewriteAbortControllerRef.current = fetchController;
    
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
              setIsRewriteLoading(false);
              message.success('文案仿写完成');
              break;
            }
            
            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            // 处理每一行数据，每行都是一个完整的JSON
            for (let i = 0; i < lines.length; i++) {
              try {
                const line = lines[i].trim();
                if (!line) continue;
                

                if (line.startsWith('id:')) continue;
                if (line.startsWith('event:')) continue;


                let event; // 使用 let 声明变量

                // 解析JSON格式的SSE消息
                if (line.startsWith('data:')) {
                  console.log('line.slice(5)::', line.slice(5));
                  if (line.slice(5) === '') continue;
                  event = JSON.parse(line.slice(5)); // 不需要重新声明
                } else if (line.startsWith('{')) {
                  event = JSON.parse(line);
                } else {
                  continue; // 添加分号
                }
                
                
                // 根据事件类型处理
                if (event.type === 'message') {
                  // 直接添加消息内容到输出
                  setRewriteOutputText(prev => prev + (event.content || ''));
                } else if (event.type === 'error') {
                  console.error('处理SSE流时出错:', event.content);
                  setRewriteError('处理过程中出现错误: ' + (event.content || ''));
                  setIsRewriteLoading(false);
                  break;
                } else if (event.type === 'done') {
                  setIsRewriteLoading(false);
                  message.success('文案生成完成');
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
          setRewriteError('处理过程中出现错误');
          setIsRewriteLoading(false);
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
      setRewriteError(error.message || '请求失败，请稍后重试');
      setIsRewriteLoading(false);
    });
  };

  const handleGenerate = () => {
    if (!generateInputText.trim()) {
      message.warning('请输入需要生成的文案');
      return;
    }

    setIsGenerateLoading(true);
    setGenerateOutputText('');
    setGenerateError(null);
    
    // 清理之前的连接
    cleanupGenerateEventSource();

    // 创建请求体
    const requestBody = JSON.stringify({ requirement: generateInputText });
    
    // 获取token
    const token = localStorage.getItem('userToken');
    
    // 创建URL，包含查询参数
    const url = `${currentConfig.apiBaseUrl}/content/generate/stream`;
    
    // 创建POST请求的EventSource
    const fetchController = new AbortController();
    generateAbortControllerRef.current = fetchController;
    
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
              setIsGenerateLoading(false);
              message.success('文案生成完成');
              break;
            }
            
            const text = decoder.decode(value, { stream: true });
            console.log('text::', text);
            const lines = text.split('\n').filter(line => line.trim() !== '');
            console.log('lines::', lines);
            
            // 处理每一行数据，每行都是一个完整的JSON
            for (let i = 0; i < lines.length; i++) {
              try {
                const line = lines[i].trim();
                if (!line) continue;
                

                if (line.startsWith('id:')) continue;
                if (line.startsWith('event:')) continue;


                let event; // 使用 let 声明变量

                // 解析JSON格式的SSE消息
                if (line.startsWith('data:')) {
                  console.log('line.slice(5)::', line.slice(5));
                  if (line.slice(5) === '') continue;
                  event = JSON.parse(line.slice(5)); // 不需要重新声明
                } else if (line.startsWith('{')) {
                  event = JSON.parse(line);
                } else {
                  continue; // 添加分号
                }
                
                
                // 根据事件类型处理
                if (event.type === 'message') {
                  // 直接添加消息内容到输出
                  setGenerateOutputText(prev => prev + (event.content || ''));
                } else if (event.type === 'error') {
                  console.error('处理SSE流时出错:', event.content);
                  setGenerateError('处理过程中出现错误: ' + (event.content || ''));
                  setIsGenerateLoading(false);
                  break;
                } else if (event.type === 'done') {
                  setIsGenerateLoading(false);
                  message.success('文案生成完成');
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
          setGenerateError('处理过程中出现错误');
          setIsGenerateLoading(false);
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
      setGenerateError(error.message || '请求失败，请稍后重试');
      setIsGenerateLoading(false);
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
          <Title>内容生成</Title>
          <Paragraph style={{ fontSize: '18px' }}>
            使用我们的AI助手优化您的文案，让内容更加专业和有吸引力
          </Paragraph>
        </div>

        <Card title="文案优化" style={{ marginBottom: '20px', width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>输入文案</Text>
              <TextArea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入需要优化的文案内容..."
                style={{ marginTop: '8px', width: '100%' }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                onClick={handleOptimize} 
                loading={isLoading}
                disabled={!inputText.trim()}
              >
                开始优化
              </Button>
            </div>
            
            <div style={{ width: '100%' }}>
              <Text strong>优化结果</Text>
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
                    <Spin tip="优化中..." />
                  </div>
                )}
                {outputText && (
                  <div className="typing-output output-container">
                    {outputText}
                  </div>
                )}
                {!outputText && !isLoading && !error && (
                  <div className="output-container output-placeholder">
                    优化后的文案将显示在这里...
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

        <Card title="文案仿写" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>输入文案</Text>
              <TextArea
                rows={6}
                value={rewriteInputText}
                onChange={(e) => setRewriteInputText(e.target.value)}
                placeholder="请输入需要仿写的文案内容..."
                style={{ marginTop: '8px', width: '100%' }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                onClick={handleRewrite} 
                loading={isRewriteLoading}
                disabled={!rewriteInputText.trim()}
              >
                开始仿写
              </Button>
            </div>
            
            <div style={{ width: '100%' }}>
              <Text strong>仿写结果</Text>
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
                {isRewriteLoading && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spin tip="仿写中..." />
                  </div>
                )}
                {rewriteOutputText && (
                  <div className="typing-output output-container">
                    {rewriteOutputText}
                  </div>
                )}
                {!rewriteOutputText && !isRewriteLoading && !rewriteError && (
                  <div className="output-container output-placeholder">
                    仿写后的文案将显示在这里...
                  </div>
                )}
                {rewriteError && (
                  <Alert
                    message="错误"
                    description={rewriteError}
                    type="error"
                    showIcon
                  />
                )}
              </div>
            </div>
          </Space>
        </Card>

        <Card title="文案生成" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>输入文案</Text>
              <TextArea
                rows={6}
                value={generateInputText}
                onChange={(e) => setGenerateInputText(e.target.value)}
                placeholder="请输入需要生成的文案内容..."
                style={{ marginTop: '8px', width: '100%' }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                onClick={handleGenerate} 
                loading={isGenerateLoading}
                disabled={!generateInputText.trim()}
              >
                开始生成
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
                {isGenerateLoading && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spin tip="生成中..." />
                  </div>
                )}
                {generateOutputText && (
                  <div className="typing-output output-container">
                    {generateOutputText}
                  </div>
                )}
                {!generateOutputText && !isGenerateLoading && !generateError && (
                  <div className="output-container output-placeholder">
                    生成的文案将显示在这里...
                  </div>
                )}
                {generateError && (
                  <Alert
                    message="错误"
                    description={generateError}
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

export default ContentGenerationPage;
