import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Title, Text } = Typography;

interface LoginFormData {
  phone: string;
  code: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        message.error('请输入正确的手机号');
        return;
      }

      setLoading(true);
      await request.post('/users/send-code', { phone });
      message.success('验证码发送成功');
      startCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: LoginFormData) => {
    try {
      setLoading(true);
      const response = await request.post('/users/login', values, {
        headers: {
          'Content-Type': 'application/json', // 明确告诉后端发送的是 JSON
        },
        responseType: 'json', // 强制解析为 JSON
      });
      console.log('登录请求完整响应:', response);

      if (!response || !response.data) {
        throw new Error('服务器响应数据格式错误');
      }

      const token = response.data.data?.token;
      
      if (!token) {
        throw new Error('未获取到token');
      }

      // 将token存储到userToken键中
      localStorage.setItem('userToken', token);
      message.success('登录成功');
      window.location.href = '/';
    } catch (error) {
      console.error('登录失败:', error);
      message.error(error instanceof Error ? error.message : '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}
    >
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card 
            bordered={false}
            style={{ 
              width: '100%', 
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '30px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={2} style={{ margin: 0, color: '#1a237e' }}>AI 内容助手</Title>
              <Text type="secondary">登录以使用AI内容生成功能</Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' }, 
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#1a237e' }} />} 
                  placeholder="请输入手机号" 
                  maxLength={11}
                  style={{ borderRadius: '8px', height: '45px' }}
                />
              </Form.Item>

              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input 
                    prefix={<LockOutlined style={{ color: '#1a237e' }} />} 
                    placeholder="请输入验证码" 
                    maxLength={6}
                    style={{ borderRadius: '8px', height: '45px' }}
                  />
                  <Button
                    type="primary"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    loading={loading}
                    icon={<SendOutlined />}
                    style={{ 
                      height: '45px',
                      minWidth: '120px',
                      borderRadius: '8px'
                    }}
                  >
                    {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                  </Button>
                </div>
              </Form.Item>

              <Form.Item style={{ marginTop: '30px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  style={{ 
                    height: '45px',
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;