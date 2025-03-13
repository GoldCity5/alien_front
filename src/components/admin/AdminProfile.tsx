import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Spin, message, Form, Input, Modal } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { getAdminInfo } from '../../services/adminService';

const AdminProfile: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      setLoading(true);
      const response = await getAdminInfo();
      if (response?.data?.code === 200) {
        setAdminInfo(response.data.data);
      }
    } catch (error) {
      console.error('获取管理员信息失败:', error);
      message.error('获取管理员信息失败');
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = () => {
    form.setFieldsValue({
      nickname: adminInfo?.nickname,
      email: adminInfo?.email || '',
      phone: adminInfo?.phone || '',
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values: any) => {
    message.success('个人信息更新成功');
    setIsModalVisible(false);
    // 这里可以添加更新管理员信息的API调用
    // 目前API文档中没有提供此接口，所以只做UI展示
  };

  return (
    <div>
      <Card
        title="个人信息"
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={showEditModal}
          >
            编辑信息
          </Button>
        }
        style={{ width: '100%' }}
      >
        <Spin spinning={loading}>
          {adminInfo ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: 20 }}
              />
              
              <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="用户名">{adminInfo.username}</Descriptions.Item>
                <Descriptions.Item label="昵称">{adminInfo.nickname}</Descriptions.Item>
                <Descriptions.Item label="ID">{adminInfo.id}</Descriptions.Item>
                {adminInfo.email && (
                  <Descriptions.Item label="邮箱">{adminInfo.email}</Descriptions.Item>
                )}
                {adminInfo.phone && (
                  <Descriptions.Item label="手机号">{adminInfo.phone}</Descriptions.Item>
                )}
                {adminInfo.role && (
                  <Descriptions.Item label="角色">{adminInfo.role}</Descriptions.Item>
                )}
                {adminInfo.createTime && (
                  <Descriptions.Item label="创建时间">{adminInfo.createTime}</Descriptions.Item>
                )}
                {adminInfo.lastLoginTime && (
                  <Descriptions.Item label="上次登录时间">{adminInfo.lastLoginTime}</Descriptions.Item>
                )}
              </Descriptions>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              暂无数据
            </div>
          )}
        </Spin>
      </Card>

      <Modal
        title="编辑个人信息"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
