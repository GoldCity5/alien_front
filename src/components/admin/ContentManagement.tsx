import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Form, message, Modal, Typography, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getRecordList, getRecordDetail } from '../../services/adminService';

const { Option } = Select;
const { Paragraph, Title } = Typography;

interface RecordItem {
  id: number;
  userId: number;
  modelName: string;
  operationType: string;
  systemPromptText: string;
  userPromptText: string;
  content: string;
  errorMessage: string | null;
  createTime: string;
  updateTime: string;
}

interface RecordResponse {
  code: number;
  message: string;
  data: {
    records: RecordItem[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

interface RecordDetailResponse {
  code: number;
  message: string;
  data: RecordItem;
}

const ContentManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<RecordItem | null>(null);
  
  // 获取记录列表数据
  const fetchRecords = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getRecordList({
        current: page,
        size: pageSize,
      });
      
      const { data } = response.data as RecordResponse;
      
      if (data) {
        setRecords(data.records);
        setPagination({
          current: data.current,
          pageSize: data.size,
          total: data.total,
        });
      }
    } catch (error) {
      console.error('获取记录列表失败:', error);
      message.error('获取记录列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取记录详情
  const fetchRecordDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const response = await getRecordDetail(id);
      const { data } = response.data as RecordDetailResponse;
      
      if (data) {
        setCurrentRecord(data);
        setDetailVisible(true);
      }
    } catch (error) {
      console.error('获取记录详情失败:', error);
      message.error('获取记录详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 首次加载和分页变化时获取数据
  useEffect(() => {
    fetchRecords(pagination.current, pagination.pageSize);
  }, []);
  
  // 处理分页变化
  const handleTableChange = (newPagination: any) => {
    fetchRecords(newPagination.current, newPagination.pageSize);
  };
  
  // 处理查看详情
  const handleViewDetail = (record: RecordItem) => {
    fetchRecordDetail(record.id);
  };
  
  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentRecord(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      ellipsis: true,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          'generate-media-plan': { color: 'blue', text: '媒体计划生成' },
          'generate-basic-media-plan': { color: 'green', text: '基础信息生成' },
          'content-optimization': { color: 'purple', text: '内容优化' },
          'script-generation': { color: 'orange', text: '脚本生成' },
          'generate-content-topic': { color: 'red', text: '内容选题' },
        };
        const { color, text } = typeMap[type] || { color: 'default', text: type };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '系统提示词',
      dataIndex: 'systemPromptText',
      key: 'systemPromptText',
      ellipsis: true,
      width: 200,
    },
    {
      title: '用户提示词',
      dataIndex: 'userPromptText',
      key: 'userPromptText',
      ellipsis: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: RecordItem, b: RecordItem) => 
        new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RecordItem) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="内容记录管理">
        <div style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item name="keyword">
              <Input 
                placeholder="关键词搜索" 
                prefix={<SearchOutlined />} 
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="operationType">
              <Select placeholder="操作类型" style={{ width: 150 }}>
                <Option value="">全部</Option>
                <Option value="generate-media-plan">媒体计划生成</Option>
                <Option value="generate-basic-media-plan">基础信息生成</Option>
                <Option value="content-optimization">内容优化</Option>
                <Option value="script-generation">脚本生成</Option>
                <Option value="generate-content-topic">内容选题</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => fetchRecords(1, pagination.pageSize)}>刷新</Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={records} 
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Card>
      
      {/* 记录详情弹窗 */}
      <Modal
        title="记录详情"
        open={detailVisible}
        onCancel={handleCloseDetail}
        footer={[
          <Button key="close" onClick={handleCloseDetail}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>加载中...</div>
        ) : currentRecord ? (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{currentRecord.userId}</Descriptions.Item>
              <Descriptions.Item label="模型名称">{currentRecord.modelName}</Descriptions.Item>
              <Descriptions.Item label="操作类型">
                {(() => {
                  const typeMap: Record<string, { color: string; text: string }> = {
                    'generate-media-plan': { color: 'blue', text: '媒体计划生成' },
                    'generate-basic-media-plan': { color: 'green', text: '基础信息生成' },
                    'content-optimization': { color: 'purple', text: '内容优化' },
                    'script-generation': { color: 'orange', text: '脚本生成' },
                    'generate-content-topic': { color: 'red', text: '内容选题' },
                  };
                  const { text } = typeMap[currentRecord.operationType] || 
                    { color: 'default', text: currentRecord.operationType };
                  return text;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{currentRecord.updateTime}</Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24 }}>
              <Title level={5}>系统提示词</Title>
              <Card>
                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                  {currentRecord.systemPromptText}
                </Paragraph>
              </Card>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>用户提示词</Title>
              <Card>
                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                  {currentRecord.userPromptText}
                </Paragraph>
              </Card>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>内容</Title>
              <Card>
                <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}>
                  {currentRecord.content}
                </Paragraph>
              </Card>
            </div>
            
            {currentRecord.errorMessage && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>错误信息</Title>
                <Card>
                  <Paragraph type="danger">
                    {currentRecord.errorMessage}
                  </Paragraph>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>无数据</div>
        )}
      </Modal>
    </div>
  );
};

export default ContentManagement;
