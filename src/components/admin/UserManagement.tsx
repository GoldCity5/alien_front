import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Form, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getUserList, updateUserStatus, UserListRequestParams } from '../../services/adminService';

const { Option } = Select;

interface UserData {
  id: number;
  nickname: string;
  phone: string;
  avatar: string;
  status: number;
  lastLoginTime: string;
  createTime: string;
}

const UserManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
  });
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: UserData, b: UserData) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserData) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => handleViewUser(record)}>查看</Button>
          <Button 
            type="link" 
            danger 
            size="small" 
            onClick={() => {
              const newStatus = record.status === 1 ? 0 : 1;
              message.info(`正在${newStatus === 1 ? '启用' : '禁用'}用户...`);
              updateUserStatus({
                userId: record.id,
                status: newStatus,
              }).then(response => {
                if (response?.data?.code === 0) {
                  message.success(`${newStatus === 1 ? '启用' : '禁用'}成功`);
                  fetchUserList(form.getFieldsValue());
                } else {
                  message.error(response?.data?.message || `操作失败`);
                }
              }).catch(error => {
                console.error('操作失败:', error);
                message.error('操作失败');
              });
            }}
          >
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUserList();
  }, [pagination.current, pagination.pageSize]);

  const fetchUserList = async (formValues?: any) => {
    setLoading(true);
    try {
      const params: UserListRequestParams = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
      };
      
      const response = await getUserList(params);
      if (response?.data?.code === 0) {
        const { records, total } = response.data.data;
        setUserData(records);
        setPagination({
          ...pagination,
          total,
        });
      } else {
        message.error(response?.data?.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchUserList(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchUserList();
  };

  const handleViewUser = (record: UserData) => {
    // 查看用户详情，可以在这里实现跳转到用户详情页或弹出详情模态框
    message.info(`查看用户: ${record.nickname}`);
  };

  return (
    <div>
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            添加用户
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Form form={form} layout="inline">
            <Form.Item name="nickname">
              <Input 
                placeholder="用户昵称" 
                prefix={<SearchOutlined />} 
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="phone">
              <Input 
                placeholder="手机号" 
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item name="status">
              <Select placeholder="状态" style={{ width: 120 }}>
                <Option value="">全部</Option>
                <Option value={1}>正常</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>查询</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleReset}>重置</Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={userData} 
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
