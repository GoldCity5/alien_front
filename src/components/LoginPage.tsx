import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Row, Col, Radio } from 'antd';
import { UserOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface LoginFormData {
  phone: string;
  code?: string;
  password?: string;
  loginType: 'code' | 'password';
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginType, setLoginType] = useState<'code' | 'password'>('code');

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
      await form.validateFields(['phone']);
      const phone = form.getFieldValue('phone');

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

  const handleSubmit = async (values: Partial<LoginFormData>) => {
    try {
      setLoading(true);

      const payload: LoginFormData = {
        phone: values.phone!,
        loginType: loginType,
      };

      if (loginType === 'code') {
        if (!values.code) {
          message.error('请输入验证码');
          setLoading(false);
          return;
        }
        payload.code = values.code;
      } else {
        if (!values.password) {
          message.error('请输入密码');
          setLoading(false);
          return;
        }
        payload.password = values.password;
      }

      console.log('登录请求载荷:', payload);

      const response = await request.post('/users/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
      });

      if (response && response.data && response.data.code !== 0) {
        message.error(response.data.message || '登录失败');
        setLoading(false);
        return;
      }

      const token = response.data?.data?.token;

      if (!token) {
        message.error('登录失败，无法获取凭证');
        setLoading(false);
        return;
      }

      localStorage.setItem('userToken', token);
      console.log('LoginPage: Token set in localStorage:', localStorage.getItem('userToken')); 
      message.success('登录成功');
      // 改回使用 window.location.href 进行跳转，强制刷新页面
      window.location.href = '/';
    } catch (error: any) {
      console.error('登录失败:', error);
      const errorMessage = error.response?.data?.message || (error instanceof Error ? error.message : '登录失败，请稍后重试');
      message.error(errorMessage);
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
        padding: '20px',
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
              overflow: 'hidden',
            }}
            bodyStyle={{ padding: '30px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={2} style={{ margin: 0, color: '#1a237e' }}>
                AI 内容助手
              </Title>
              <Text type="secondary">登录以使用AI内容生成功能</Text>
            </div>

            <Form.Item style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Radio.Group onChange={(e) => setLoginType(e.target.value)} value={loginType}>
                <Radio.Button value="code">验证码登录</Radio.Button>
                <Radio.Button value="password">密码登录</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1a237e' }} />}
                  placeholder="请输入手机号"
                  maxLength={11}
                  style={{ borderRadius: '8px', height: '45px' }}
                />
              </Form.Item>

              {loginType === 'code' ? (
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
                      loading={loading && countdown === 0}
                      icon={<SendOutlined />}
                      style={{
                        height: '45px',
                        minWidth: '120px',
                        borderRadius: '8px',
                      }}
                    >
                      {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                    </Button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#1a237e' }} />}
                    placeholder="请输入密码"
                    style={{ borderRadius: '8px', height: '45px' }}
                  />
                </Form.Item>
              )}

              <Form.Item style={{ marginTop: '20px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading && countdown > 0}
                  block
                  style={{
                    height: '45px',
                    fontSize: '16px',
                    borderRadius: '8px',
                  }}
                >
                  登录
                </Button>
              </Form.Item>

              <Row justify="space-between">
                <Col>
                  <Link to="/register">注册新账号</Link>
                </Col>
                <Col>
                  <Link to="/reset-password">忘记密码？</Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;