import React from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Form } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagement: React.FC = () => {
  // 这是一个示例组件，实际使用时需要根据后端API进行数据获取和操作
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
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
      sorter: (a: any, b: any) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
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
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small">
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      username: '用户1',
      phone: '13800138000',
      createTime: '2025-03-01 10:00:00',
      status: 1,
    },
    {
      id: 2,
      username: '用户2',
      phone: '13800138001',
      createTime: '2025-03-02 11:00:00',
      status: 1,
    },
    {
      id: 3,
      username: '用户3',
      phone: '13800138002',
      createTime: '2025-03-03 12:00:00',
      status: 0,
    },
  ];

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
          <Form layout="inline">
            <Form.Item name="keyword">
              <Input 
                placeholder="用户名/手机号" 
                prefix={<SearchOutlined />} 
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="status">
              <Select placeholder="状态" style={{ width: 120 }}>
                <Option value="">全部</Option>
                <Option value="1">正常</Option>
                <Option value="0">禁用</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>
            <Form.Item>
              <Button>重置</Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
