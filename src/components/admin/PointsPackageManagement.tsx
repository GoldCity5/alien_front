import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Typography,
  Tag,
  Card,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  getPointsPackages,
  createPointsPackage,
  updatePointsPackage,
  updatePointsPackageStatus,
  deletePointsPackage,
  PointsPackage
} from '../../services/pointsService';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PointsPackageManagement: React.FC = () => {
  // 套餐列表状态
  const [packages, setPackages] = useState<PointsPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 表单状态
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('创建积分套餐');
  const [modalLoading, setModalLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PointsPackage | null>(null);

  // 获取积分套餐列表
  const fetchPackages = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const data = await getPointsPackages({ page, size });
      setPackages(data.records);
      setPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } catch (error) {
      console.error('获取积分套餐列表失败:', error);
      message.error('获取积分套餐列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 处理表格分页变化
  const handleTableChange = (pagination: any) => {
    fetchPackages(pagination.current, pagination.pageSize);
  };

  // 打开创建套餐模态框
  const showCreateModal = () => {
    setEditingPackage(null);
    setModalTitle('创建积分套餐');
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      sortOrder: 1
    });
    setModalVisible(true);
  };

  // 打开编辑套餐模态框
  const showEditModal = (record: PointsPackage) => {
    setEditingPackage(record);
    setModalTitle('编辑积分套餐');
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      pointsAmount: record.pointsAmount,
      price: record.price,
      discountPrice: record.discountPrice,
      description: record.description,
      status: record.status,
      sortOrder: record.sortOrder
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      
      if (editingPackage) {
        // 更新套餐
        await updatePointsPackage(editingPackage.id, values);
        message.success('更新积分套餐成功');
      } else {
        // 创建套餐
        await createPointsPackage(values);
        message.success('创建积分套餐成功');
      }
      
      setModalVisible(false);
      fetchPackages(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    } finally {
      setModalLoading(false);
    }
  };

  // 更新套餐状态
  const handleStatusChange = async (id: number, status: number) => {
    try {
      await updatePointsPackageStatus(id, status);
      message.success('状态更新成功');
      fetchPackages(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error('更新状态失败');
    }
  };

  // 删除套餐
  const handleDelete = async (id: number) => {
    try {
      await deletePointsPackage(id);
      message.success('删除成功');
      fetchPackages(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '积分数量',
      dataIndex: 'pointsAmount',
      key: 'pointsAmount',
      render: (pointsAmount: number) => (
        <Text strong style={{ color: '#1890ff' }}>{pointsAmount}</Text>
      )
    },
    {
      title: '原价(元)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`
    },
    {
      title: '优惠价(元)',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
      render: (discountPrice: number, record: PointsPackage) => (
        <Space>
          <Text strong style={{ color: '#52c41a' }}>¥{discountPrice.toFixed(2)}</Text>
          {record.price > discountPrice && (
            <Tag color="red">
              {Math.round((1 - discountPrice / record.price) * 100)}% 折扣
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PointsPackage) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          {record.status === 1 ? (
            <Tooltip title="禁用">
              <Button
                danger
                icon={<StopOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, 0)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="启用">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, 1)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个积分套餐吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="积分套餐列表"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchPackages(pagination.current, pagination.pageSize)}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              创建套餐
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={packages}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 创建/编辑套餐模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={modalLoading}
        maskClosable={false}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="套餐名称"
            rules={[{ required: true, message: '请输入套餐名称' }]}
          >
            <Input placeholder="请输入套餐名称" />
          </Form.Item>
          
          <Form.Item
            name="pointsAmount"
            label="积分数量"
            rules={[
              { required: true, message: '请输入积分数量' },
              { type: 'number', min: 1, message: '积分数量必须大于0' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入积分数量" />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="原价(元)"
            rules={[
              { required: true, message: '请输入原价' },
              { type: 'number', min: 0, message: '原价不能为负数' }
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入原价"
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => Number(value!.replace(/\¥\s?|(,*)/g, ''))}
            />
          </Form.Item>
          
          <Form.Item
            name="discountPrice"
            label="优惠价(元)"
            rules={[
              { required: true, message: '请输入优惠价' },
              { type: 'number', min: 0, message: '优惠价不能为负数' }
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入优惠价"
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => Number(value!.replace(/\¥\s?|(,*)/g, ''))}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="套餐描述"
          >
            <TextArea rows={3} placeholder="请输入套餐描述" />
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
            name="sortOrder"
            label="排序值"
            rules={[
              { required: true, message: '请输入排序值' },
              { type: 'number', min: 1, message: '排序值必须大于0' }
            ]}
            tooltip="数值越小排序越靠前"
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsPackageManagement;
