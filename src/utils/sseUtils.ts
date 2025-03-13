// 移除未使用的导入
// import { message } from 'antd';

interface SSEOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  body?: any;
  onMessage: (content: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
  onStart?: () => void;
}

/**
 * 处理SSE（Server-Sent Events）流的通用方法
 * @param options SSE选项
 * @returns 取消函数，调用可以中断SSE流
 */
export const handleSSEStream = async (options: SSEOptions) => {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    onMessage,
    onError,
    onDone,
    onStart
  } = options;

  try {
    // 调用开始回调
    if (onStart) {
      onStart();
    }

    // 准备请求选项
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    };

    // 发送请求
    const response = await fetch(url, requestOptions);

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
        let buffer = ''; // 用于存储跨块的不完整行
        
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (onDone) {
              onDone();
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // 按行分割，保留可能不完整的最后一行
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 最后一行可能不完整，保存到buffer
          
          // 处理完整的行
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            try {
              // 处理SSE格式的行
              if (trimmedLine.startsWith('data:')) {
                const data = trimmedLine.slice(5).trim();
                if (!data) continue;
                
                try {
                  // 尝试解析为JSON
                  const event = JSON.parse(data);
                  
                  if (event.type === 'message') {
                    onMessage(event.content || '');
                  } else if (event.type === 'error') {
                    if (onError) {
                      onError(event.content || '未知错误');
                    }
                  } else if (event.type === 'done') {
                    if (onDone) {
                      onDone();
                    }
                  }
                } catch (jsonError) {
                  // 如果不是JSON，直接将内容传递给onMessage
                  console.log('非JSON格式的数据:', data);
                  onMessage(data);
                }
              } 
              // 处理直接是JSON的行
              else if (trimmedLine.startsWith('{')) {
                try {
                  const event = JSON.parse(trimmedLine);
                  
                  if (event.type === 'message') {
                    onMessage(event.content || '');
                  } else if (event.type === 'error') {
                    if (onError) {
                      onError(event.content || '未知错误');
                    }
                  } else if (event.type === 'done') {
                    if (onDone) {
                      onDone();
                    }
                  }
                } catch (jsonError) {
                  console.error('解析JSON失败:', jsonError);
                }
              }
              // 处理纯文本内容
              else if (!trimmedLine.startsWith('id:') && !trimmedLine.startsWith('event:')) {
                // 直接将内容传递给onMessage
                onMessage(trimmedLine);
              }
            } catch (lineError) {
              console.error('处理行时出错:', lineError, '原始行:', trimmedLine);
            }
          }
        }
      } catch (error) {
        console.error('处理SSE流时出错:', error);
        if (onError) {
          onError('处理过程中出现错误');
        }
      }
    };

    // 开始处理流
    processStream();

    // 返回取消函数
    return () => {
      reader.cancel();
    };
  } catch (error: any) {
    console.error('SSE请求错误:', error);
    if (onError) {
      onError(error.message || '请求失败，请稍后重试');
    }
    return () => {}; // 返回空函数
  }
};
