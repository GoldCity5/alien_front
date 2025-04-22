import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, SendOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

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
      setCodeLoading(true);
      await request.post('/users/send-code', { phone });
      message.success('验证码发送成功');
      startCountdown();
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      const errorMessage = error.response?.data?.message || '发送验证码失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    if (values.password.length < 6) {
        message.error('密码长度至少为6位');
        return;
    }

    try {
      setLoading(true);
      const payload = {
        phone: values.phone,
        code: values.code,
        password: values.password,
      };
      
      console.log('注册请求载荷:', payload);
      const response = await request.post('/users/register', payload);

      if (response && response.data && response.data.code === 200) {
        message.success('注册成功！请使用新账号登录。');
        navigate('/login'); // 注册成功后跳转到登录页
      } else {
         message.error(response?.data?.message || '注册失败，请稍后重试');
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      const errorMessage = error.response?.data?.message || '注册失败，请检查信息或稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px' }}>
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card bordered={false} style={{ width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }} bodyStyle={{ padding: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={2} style={{ margin: 0, color: '#1a237e' }}>创建新账号</Title>
              <Text type="secondary">加入我们，开启AI创作之旅</Text>
            </div>
            <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
              <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input prefix={<UserOutlined style={{ color: '#1a237e' }} />} placeholder="请输入手机号" maxLength={11} style={{ borderRadius: '8px', height: '45px' }} />
              </Form.Item>
              <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input prefix={<SafetyCertificateOutlined style={{ color: '#1a237e' }} />} placeholder="请输入验证码" maxLength={6} style={{ borderRadius: '8px', height: '45px' }} />
                  <Button type="primary" onClick={handleSendCode} disabled={countdown > 0} loading={codeLoading} icon={<SendOutlined />} style={{ height: '45px', minWidth: '120px', borderRadius: '8px' }}>
                    {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                  </Button>
                </div>
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码长度至少为6位' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#1a237e' }} />} placeholder="请输入密码（至少6位）" style={{ borderRadius: '8px', height: '45px' }} />
              </Form.Item>
              <Form.Item name="confirmPassword" dependencies={['password']} rules={[{ required: true, message: '请确认密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('两次输入的密码不一致')); } })]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#1a237e' }} />} placeholder="请再次输入密码" style={{ borderRadius: '8px', height: '45px' }} />
              </Form.Item>
              <Form.Item style={{ marginTop: '20px' }}>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px', fontSize: '16px', borderRadius: '8px' }}>
                  注册
                </Button>
              </Form.Item>
               <Row justify="center">
                 <Col>
                   <Link to="/login">已有账号？直接登录</Link>
                 </Col>
               </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
