import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, InputNumber, Tabs, message, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = (values: any) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      console.log('保存系统设置:', values);
      message.success('系统设置保存成功');
      setLoading(false);
    }, 1000);
  };

  // 默认系统设置
  const defaultSettings = {
    siteName: '小巷创意',
    siteDescription: 'AI内容创作平台',
    logo: '/logo.svg',
    recordNumber: 'ICP备XXXXXXXX号',
    contactEmail: 'support@example.com',
    enableRegistration: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
  };

  return (
    <Card title="系统设置">
      <Tabs defaultActiveKey="basic">
        <TabPane tab="基本设置" key="basic">
          <Form
            form={form}
            layout="vertical"
            initialValues={defaultSettings}
            onFinish={handleSave}
          >
            <Divider orientation="left">网站信息</Divider>
            
            <Form.Item
              name="siteName"
              label="网站名称"
              rules={[{ required: true, message: '请输入网站名称' }]}
            >
              <Input placeholder="请输入网站名称" />
            </Form.Item>
            
            <Form.Item
              name="siteDescription"
              label="网站描述"
            >
              <Input.TextArea placeholder="请输入网站描述" rows={3} />
            </Form.Item>
            
            <Form.Item
              name="logo"
              label="网站Logo"
            >
              <Input placeholder="请输入Logo URL" />
            </Form.Item>
            
            <Form.Item
              name="recordNumber"
              label="备案号"
            >
              <Input placeholder="请输入备案号" />
            </Form.Item>
            
            <Form.Item
              name="contactEmail"
              label="联系邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            
            <Divider orientation="left">用户设置</Divider>
            
            <Form.Item
              name="enableRegistration"
              label="开启注册"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              name="maxLoginAttempts"
              label="最大登录尝试次数"
              rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
            >
              <InputNumber min={1} max={10} style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item
              name="sessionTimeout"
              label="会话超时时间(分钟)"
              rules={[{ required: true, message: '请输入会话超时时间' }]}
            >
              <InputNumber min={5} max={120} style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存设置
              </Button>
              <Button 
                style={{ marginLeft: 8 }} 
                icon={<ReloadOutlined />}
                onClick={() => form.resetFields()}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="API设置" key="api">
          <Form
            layout="vertical"
            initialValues={{
              apiRateLimit: 100,
              apiTimeout: 30,
              enableApiLogging: true,
            }}
            onFinish={handleSave}
          >
            <Form.Item
              name="apiRateLimit"
              label="API速率限制(次/分钟)"
              rules={[{ required: true, message: '请输入API速率限制' }]}
            >
              <InputNumber min={10} max={1000} style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item
              name="apiTimeout"
              label="API超时时间(秒)"
              rules={[{ required: true, message: '请输入API超时时间' }]}
            >
              <InputNumber min={5} max={120} style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item
              name="enableApiLogging"
              label="启用API日志记录"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存设置
              </Button>
              <Button 
                style={{ marginLeft: 8 }} 
                icon={<ReloadOutlined />}
                onClick={() => form.resetFields()}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="安全设置" key="security">
          <Form
            layout="vertical"
            initialValues={{
              enableCaptcha: true,
              passwordMinLength: 8,
              passwordComplexity: true,
              enableTwoFactor: false,
            }}
            onFinish={handleSave}
          >
            <Form.Item
              name="enableCaptcha"
              label="启用验证码"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              name="passwordMinLength"
              label="密码最小长度"
              rules={[{ required: true, message: '请输入密码最小长度' }]}
            >
              <InputNumber min={6} max={16} style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item
              name="passwordComplexity"
              label="启用密码复杂度要求"
              valuePropName="checked"
              extra="密码必须包含大小写字母、数字和特殊字符"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              name="enableTwoFactor"
              label="启用两因素认证"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存设置
              </Button>
              <Button 
                style={{ marginLeft: 8 }} 
                icon={<ReloadOutlined />}
                onClick={() => form.resetFields()}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SystemSettings;
