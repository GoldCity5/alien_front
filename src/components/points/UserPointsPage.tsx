import React, { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Table, Tag, Statistic, Row, Col, Select, Empty, Alert } from 'antd';
import { WalletOutlined, HistoryOutlined } from '@ant-design/icons';
import { getUserPointsInfo, getUserPointsTransactions, PointsTransaction } from '../../services/pointsService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const UserPointsPage: React.FC = () => {
  const [pointsInfo, setPointsInfo] = useState<{ userId: number; totalPoints: number } | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [transactionType, setTransactionType] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // 获取用户积分信息
  const fetchPointsInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserPointsInfo();
      setPointsInfo(data);
    } catch (err: any) {
      setError(err.message || '获取积分信息失败');
      console.error('获取积分信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取交易记录
  const fetchTransactions = async (page = 1, size = 10, type?: number) => {
    setTransactionLoading(true);
    setError(null);
    try {
      const params = { page, size, type };
      const data = await getUserPointsTransactions(params);
      setTransactions(data.records);
      setPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } catch (err: any) {
      setError(err.message || '获取交易记录失败');
      console.error('获取交易记录失败:', err);
    } finally {
      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    fetchPointsInfo();
    fetchTransactions(1, 10);
  }, []);

  // 处理表格分页变化
  const handleTableChange = (pagination: any) => {
    fetchTransactions(pagination.current, pagination.pageSize, transactionType);
  };

  // 处理交易类型筛选变化
  const handleTypeChange = (value: number | undefined) => {
    setTransactionType(value);
    fetchTransactions(1, pagination.pageSize, value);
  };

  // 交易记录表格列定义
  const columns = [
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          closable
        />
      )}

      <Title level={2}>
        <WalletOutlined /> 我的积分
      </Title>

      <Card loading={loading} style={{ marginBottom: '24px' }}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Statistic
              title="当前积分"
              value={pointsInfo?.totalPoints || 0}
              precision={0}
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
              prefix={<WalletOutlined />}
            />
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">积分可用于平台各项功能，如自媒体内容生成、账号定位等。</Text>
              <br />
              <Text type="secondary">如需更多积分，请联系管理员充值。</Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                积分交易记录
              </span>
            }
            key="1"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text>交易类型：</Text>
              <Select
                style={{ width: 120, marginLeft: '8px' }}
                placeholder="全部类型"
                onChange={handleTypeChange}
                allowClear
              >
                <Option value={1}>充值</Option>
                <Option value={2}>消费</Option>
              </Select>
            </div>

            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              onChange={handleTableChange}
              loading={transactionLoading}
              locale={{
                emptyText: <Empty description="暂无交易记录" />,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserPointsPage;
