import React from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Form, Tabs } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const ContentManagement: React.FC = () => {
  // 这是一个示例组件，实际使用时需要根据后端API进行数据获取和操作
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          'content': { color: 'blue', text: '内容优化' },
          'title': { color: 'purple', text: '标题生成' },
          'script': { color: 'orange', text: '脚本生成' },
        };
        const { color, text } = typeMap[type] || { color: 'default', text: type };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: any, b: any) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : status === 0 ? 'orange' : 'red'}>
          {status === 1 ? '已发布' : status === 0 ? '草稿' : '已删除'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">查看</Button>
          <Button type="link" icon={<EditOutlined />} size="small">编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      title: '如何提高工作效率的10个技巧',
      type: 'content',
      creator: '用户1',
      createTime: '2025-03-01 10:00:00',
      status: 1,
    },
    {
      id: 2,
      title: '2025年最受欢迎的10款手机',
      type: 'title',
      creator: '用户2',
      createTime: '2025-03-02 11:00:00',
      status: 1,
    },
    {
      id: 3,
      title: '如何制作一个成功的短视频脚本',
      type: 'script',
      creator: '用户3',
      createTime: '2025-03-03 12:00:00',
      status: 0,
    },
    {
      id: 4,
      title: '健康饮食的重要性与方法',
      type: 'content',
      creator: '用户4',
      createTime: '2025-03-04 13:00:00',
      status: 1,
    },
    {
      id: 5,
      title: '学习编程的五个步骤',
      type: 'content',
      creator: '用户5',
      createTime: '2025-03-05 14:00:00',
      status: 1,
    },
  ];

  return (
    <div>
      <Card title="内容管理">
        <Tabs defaultActiveKey="all">
          <TabPane tab="全部内容" key="all">
            <div style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="keyword">
                  <Input 
                    placeholder="标题/内容关键词" 
                    prefix={<SearchOutlined />} 
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item name="type">
                  <Select placeholder="内容类型" style={{ width: 120 }}>
                    <Option value="">全部</Option>
                    <Option value="content">内容优化</Option>
                    <Option value="title">标题生成</Option>
                    <Option value="script">脚本生成</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status">
                  <Select placeholder="状态" style={{ width: 120 }}>
                    <Option value="">全部</Option>
                    <Option value="1">已发布</Option>
                    <Option value="0">草稿</Option>
                    <Option value="-1">已删除</Option>
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
          </TabPane>
          <TabPane tab="内容优化" key="content">
            <Table 
              columns={columns} 
              dataSource={data.filter(item => item.type === 'content')} 
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="标题生成" key="title">
            <Table 
              columns={columns} 
              dataSource={data.filter(item => item.type === 'title')} 
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="脚本生成" key="script">
            <Table 
              columns={columns} 
              dataSource={data.filter(item => item.type === 'script')} 
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ContentManagement;
