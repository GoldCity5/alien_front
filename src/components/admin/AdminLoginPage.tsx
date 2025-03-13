import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminService';

const { Title, Text } = Typography;

interface AdminLoginFormData {
  username: string;
  password: string;
}

const AdminLoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: AdminLoginFormData) => {
    try {
      setLoading(true);
      const response = await adminLogin(values);
      
      if (!response || !response.data) {
        throw new Error('服务器响应数据格式错误');
      }

      const { token, nickname } = response.data.data;
      
      if (!token) {
        throw new Error('未获取到token');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('adminNickname', nickname);
      localStorage.setItem('isAdmin', 'true');
      
      message.success('登录成功');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      message.error('用户名或密码错误，请重试');
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
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
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
              <Title level={2} style={{ margin: 0, color: '#1a237e' }}>管理员登录</Title>
              <Text type="secondary">请输入管理员账号和密码</Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#1a237e' }} />} 
                  placeholder="请输入用户名" 
                  style={{ borderRadius: '8px', height: '45px' }}
                />
              </Form.Item>

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

              <Form.Item style={{ marginTop: '30px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  style={{ 
                    height: '45px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    background: '#1a237e'
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

export default AdminLoginPage;
