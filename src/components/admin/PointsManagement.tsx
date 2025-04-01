import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
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
  Row,
  Col
} from 'antd';
import { ReloadOutlined, WalletOutlined, HistoryOutlined, PlusOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import { 
  getAdminUserPointsList, 
  getAdminPointsTransactions, 
  rechargeUserPoints,
  UserPointsItem,
  PointsTransaction
} from '../../services/pointsService';
import PointsFeatureManagement from './PointsFeatureManagement';
import PointsPackageManagement from './PointsPackageManagement';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const PointsManagement: React.FC = () => {
  // 用户积分列表状态
  const [userPoints, setUserPoints] = useState<UserPointsItem[]>([]);
  const [userPointsLoading, setUserPointsLoading] = useState(false);
  const [userPointsPagination, setUserPointsPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  
  // 交易记录列表状态
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsPagination, setTransactionsPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [transactionFilters, setTransactionFilters] = useState<{ userId?: number; type?: number }>({});
  
  // 充值模态框状态
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [rechargeForm] = Form.useForm();
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPointsItem | null>(null);

  // 获取用户积分列表
  const fetchUserPoints = async (page = 1, size = 10) => {
    setUserPointsLoading(true);
    try {
      const data = await getAdminUserPointsList({ page, size });
      setUserPoints(data.records);
      setUserPointsPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } catch (error) {
      console.error('获取用户积分列表失败:', error);
      message.error('获取用户积分列表失败');
    } finally {
      setUserPointsLoading(false);
    }
  };

  // 获取交易记录列表
  const fetchTransactions = async (page = 1, size = 10, filters = {}) => {
    setTransactionsLoading(true);
    try {
      const params = { page, size, ...filters };
      const data = await getAdminPointsTransactions(params);
      setTransactions(data.records);
      setTransactionsPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } catch (error) {
      console.error('获取交易记录列表失败:', error);
      message.error('获取交易记录列表失败');
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPoints();
    fetchTransactions();
  }, []);

  // 处理用户积分表格分页变化
  const handleUserPointsTableChange = (pagination: any) => {
    fetchUserPoints(pagination.current, pagination.pageSize);
  };

  // 处理交易记录表格分页变化
  const handleTransactionsTableChange = (pagination: any) => {
    fetchTransactions(pagination.current, pagination.pageSize, transactionFilters);
  };

  // 处理交易记录筛选变化
  const handleTransactionFilterChange = (filters: { userId?: number; type?: number }) => {
    setTransactionFilters(filters);
    fetchTransactions(1, transactionsPagination.pageSize, filters);
  };

  // 打开充值模态框
  const showRechargeModal = (user: UserPointsItem) => {
    setSelectedUser(user);
    rechargeForm.resetFields();
    rechargeForm.setFieldsValue({
      userId: user.userId,
      amount: 100,
      description: '管理员充值'
    });
    setRechargeModalVisible(true);
  };

  // 提交充值表单
  const handleRechargeSubmit = async () => {
    try {
      const values = await rechargeForm.validateFields();
      setRechargeLoading(true);
      
      await rechargeUserPoints(values);
      message.success('充值成功');
      setRechargeModalVisible(false);
      
      // 刷新用户积分列表和交易记录
      fetchUserPoints(userPointsPagination.current, userPointsPagination.pageSize);
      fetchTransactions(transactionsPagination.current, transactionsPagination.pageSize, transactionFilters);
    } catch (error) {
      console.error('充值失败:', error);
      message.error('充值失败');
    } finally {
      setRechargeLoading(false);
    }
  };

  // 用户积分表格列定义
  const userPointsColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '积分余额',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (totalPoints: number) => (
        <Text strong style={{ color: '#1890ff' }}>{totalPoints}</Text>
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
      render: (_: any, record: UserPointsItem) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="small"
            onClick={() => showRechargeModal(record)}
          >
            充值
          </Button>
        </Space>
      ),
    },
  ];

  // 交易记录表格列定义
  const transactionsColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => (
        <Tag color={type === 1 ? 'green' : 'red'}>
          {type === 1 ? '充值' : '消费'}
        </Tag>
      ),
    },
    {
      title: '积分变动',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text style={{ color: amount > 0 ? '#52c41a' : '#f5222d' }}>
          {amount > 0 ? `+${amount}` : amount}
        </Text>
      ),
    },
    {
      title: '功能名称',
      dataIndex: 'featureName',
      key: 'featureName',
      render: (featureName: string | null) => featureName || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>积分系统管理</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <WalletOutlined />
              用户积分管理
            </span>
          }
          key="1"
        >
          <Card
            title="用户积分列表"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchUserPoints(userPointsPagination.current, userPointsPagination.pageSize)}
              >
                刷新
              </Button>
            }
          >
            <Table
              columns={userPointsColumns}
              dataSource={userPoints}
              rowKey="id"
              loading={userPointsLoading}
              pagination={{
                ...userPointsPagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              onChange={handleUserPointsTableChange}
            />
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              积分交易记录
            </span>
          }
          key="2"
        >
          <Card
            title="交易记录列表"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTransactions(transactionsPagination.current, transactionsPagination.pageSize, transactionFilters)}
              >
                刷新
              </Button>
            }
          >
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Space>
                  <Text>用户ID:</Text>
                  <InputNumber
                    style={{ width: 120 }}
                    placeholder="输入用户ID"
                    onChange={(value) => handleTransactionFilterChange({ ...transactionFilters, userId: value ? Number(value) : undefined })}
                  />
                </Space>
              </Col>
              <Col span={8}>
                <Space>
                  <Text>交易类型:</Text>
                  <Select
                    style={{ width: 120 }}
                    placeholder="全部类型"
                    allowClear
                    onChange={(value) => handleTransactionFilterChange({ ...transactionFilters, type: value })}
                  >
                    <Option value={1}>充值</Option>
                    <Option value={2}>消费</Option>
                  </Select>
                </Space>
              </Col>
            </Row>
            
            <Table
              columns={transactionsColumns}
              dataSource={transactions}
              rowKey="id"
              loading={transactionsLoading}
              pagination={{
                ...transactionsPagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              onChange={handleTransactionsTableChange}
            />
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              功能积分配置
            </span>
          }
          key="3"
        >
          <PointsFeatureManagement />
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShoppingOutlined />
              积分套餐配置
            </span>
          }
          key="4"
        >
          <PointsPackageManagement />
        </TabPane>
      </Tabs>

      {/* 充值模态框 */}
      <Modal
        title={`为用户 ${selectedUser?.userId || ''} 充值积分`}
        open={rechargeModalVisible}
        onCancel={() => setRechargeModalVisible(false)}
        onOk={handleRechargeSubmit}
        confirmLoading={rechargeLoading}
        maskClosable={false}
      >
        <Form
          form={rechargeForm}
          layout="vertical"
        >
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <InputNumber style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item
            name="amount"
            label="充值积分数量"
            rules={[
              { required: true, message: '请输入充值积分数量' },
              { type: 'number', min: 1, message: '充值积分数量必须大于0' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="充值描述"
          >
            <Input.TextArea rows={3} placeholder="可选，填写充值原因或备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsManagement;
