import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  message, 
  Typography,
  Tooltip
} from 'antd';
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { 
  getFeaturePointsConfigs, 
  updateFeaturePointsConfig, 
  addFeaturePointsConfig,
  FeaturePointsConfig
} from '../../services/pointsService';

const { Title, Text } = Typography;

const PointsFeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<FeaturePointsConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  // 获取功能积分配置列表
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const data = await getFeaturePointsConfigs();
      setFeatures(data);
    } catch (error) {
      console.error('获取功能积分配置失败:', error);
      message.error('获取功能积分配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  // 打开新增功能配置模态框
  const showAddModal = () => {
    setModalTitle('添加功能积分配置');
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      status: true
    });
    setModalVisible(true);
  };

  // 打开编辑功能配置模态框
  const showEditModal = (record: FeaturePointsConfig) => {
    setModalTitle('编辑功能积分配置');
    setEditingId(record.id);
    form.setFieldsValue({
      featureKey: record.featureKey,
      featureName: record.featureName,
      pointCost: record.pointCost,
      status: record.status === 1
    });
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        status: values.status ? 1 : 0
      };

      if (editingId) {
        // 更新功能配置
        await updateFeaturePointsConfig(editingId, formData);
        message.success('更新功能积分配置成功');
      } else {
        // 添加功能配置
        await addFeaturePointsConfig(formData);
        message.success('添加功能积分配置成功');
      }

      setModalVisible(false);
      fetchFeatures();
    } catch (error) {
      console.error('表单提交失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '功能键名',
      dataIndex: 'featureKey',
      key: 'featureKey',
    },
    {
      title: '功能名称',
      dataIndex: 'featureName',
      key: 'featureName',
    },
    {
      title: '积分消耗',
      dataIndex: 'pointCost',
      key: 'pointCost',
      render: (pointCost: number) => (
        <Text strong>{pointCost} 积分</Text>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <span style={{ color: status === 1 ? '#52c41a' : '#f5222d' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FeaturePointsConfig) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>功能积分配置</Title>
            <Tooltip title="配置各功能消耗的积分数量，用户在使用功能时会自动扣除相应积分">
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加功能配置
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={features} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 添加/编辑功能配置模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="featureKey"
            label="功能键名"
            rules={[
              { required: true, message: '请输入功能键名' },
              { max: 50, message: '功能键名不能超过50个字符' }
            ]}
          >
            <Input placeholder="如: media_content_generate" />
          </Form.Item>
          <Form.Item
            name="featureName"
            label="功能名称"
            rules={[
              { required: true, message: '请输入功能名称' },
              { max: 50, message: '功能名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="如: 自媒体内容文案生成" />
          </Form.Item>
          <Form.Item
            name="pointCost"
            label="积分消耗"
            rules={[
              { required: true, message: '请输入积分消耗' },
              { type: 'number', min: 0, message: '积分消耗不能小于0' }
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="功能使用需要消耗的积分数量" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsFeatureManagement;
