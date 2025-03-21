import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Modal, Form, Select, message, Spin, Typography, Space, Tag } from 'antd';
import { EditOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { getPromptList, updatePrompt } from '../../services/adminService';

const { Option } = Select;
const { TextArea } = Input;
const { Paragraph } = Typography;

interface PromptItem {
  id: number;
  feature: string;
  name: string;
  content: string;
  type: string;
  status: number;
}

const PromptManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<PromptItem[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem | null>(null);
  const [searchFeature, setSearchFeature] = useState<string>('');

  // 功能类型选项
  const featureOptions = [
    { label: '内容优化', value: 'OPTIMIZE' },
    { label: '标题生成', value: 'TITLE' },
    { label: '脚本生成', value: 'SCRIPT' },
    { label: '文案仿写', value: 'COPYWRITING' },
    { label: '文案生成', value: 'GENERATE' },
    { label: '自媒体策划', value: 'MEDIA_PLAN' },
    { label: '基础个人策划', value: 'BASIC_MEDIA_PLAN' },
    { label: '媒体文案生成', value: 'MEDIA_CONTENT' },
    { label: '内容选题', value: 'CONTENT_TOPIC' }
  ];

  // 提示词类型选项
  const typeOptions = [
    { label: '系统提示词', value: 'system' },
    { label: '用户提示词', value: 'user' },
    { label: '辅助提示词', value: 'assistant' }
  ];

  useEffect(() => {
    fetchPromptList();
  }, []);

  // 获取提示词列表
  const fetchPromptList = async () => {
    setLoading(true);
    try {
      const response = await getPromptList();
      console.log('获取提示词列表响应:', response);
      if (response?.data?.code === 0) {
        setDataSource(response.data.data);
      } else {
        message.error('获取提示词列表失败');
      }
    } catch (error) {
      console.error('获取提示词列表失败:', error);
      message.error('获取提示词列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 打开编辑模态框
  const handleEdit = (record: PromptItem) => {
    setCurrentPrompt(record);
    form.setFieldsValue({
      feature: record.feature,
      name: record.name,
      content: record.content,
      type: record.type,
      status: record.status
    });
    setEditModalVisible(true);
  };

  // 保存提示词
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!currentPrompt) return;
      
      setLoading(true);
      const response = await updatePrompt({
        id: currentPrompt.id,
        ...values
      });
      
      console.log('更新提示词响应:', response);
      if (response?.data?.code === 0) {
        message.success('保存成功');
        setEditModalVisible(false);
        fetchPromptList();
      } else {
        message.error(response?.data?.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('表单验证失败或保存过程中出错');
    } finally {
      setLoading(false);
    }
  };

  // 根据功能筛选数据
  const filteredData = dataSource.filter(item => 
    !searchFeature || item.feature.includes(searchFeature)
  );

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '功能',
      dataIndex: 'feature',
      key: 'feature',
      width: 150,
      render: (text: string) => {
        const feature = featureOptions.find(item => item.value === text);
        return feature ? feature.label : text;
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text: string) => {
        const type = typeOptions.find(item => item.value === text);
        return type ? (
          <Tag color={text === 'system' ? 'blue' : text === 'user' ? 'green' : 'purple'}>
            {type.label}
          </Tag>
        ) : text;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '提示词内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
          {text}
        </Paragraph>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: PromptItem) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          size="small" 
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      )
    }
  ];

  return (
    <Card title="提示词管理" extra={
      <Space>
        <Select
          placeholder="选择功能筛选"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setSearchFeature(value)}
        >
          {featureOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchPromptList}
        >
          刷新
        </Button>
      </Space>
    }>
      <Spin spinning={loading}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`
          }}
        />
      </Spin>

      {/* 编辑提示词模态框 */}
      <Modal
        title="编辑提示词"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            loading={loading} 
            onClick={handleSave}
          >
            保存
          </Button>
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="feature"
            label="功能"
            rules={[{ required: true, message: '请选择功能' }]}
          >
            <Select placeholder="请选择功能">
              {featureOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入提示词名称' }]}
          >
            <Input placeholder="请输入提示词名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择提示词类型' }]}
          >
            <Select placeholder="请选择提示词类型">
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="提示词内容"
            rules={[{ required: true, message: '请输入提示词内容' }]}
          >
            <TextArea rows={10} placeholder="请输入提示词内容" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PromptManagement;
