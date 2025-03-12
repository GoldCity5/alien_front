import React, { useState } from 'react';
import { Card, Radio, Form, Input, Space, Button, message, Typography, Spin, Divider, Row, Col } from 'antd';
import request from '../utils/request';
import type { RadioChangeEvent } from 'antd';

const { Title, Paragraph, Text } = Typography;

type BusinessType = 'ip' | 'product';

interface IpFormData {
  personalInfo: string;
  accountType: string;
  purpose: string;
}

interface ProductFormData {
  productInfo: string;
  additionalInfo: string;
}

interface IpAnalysisResult {
  id: number;
  userId: number;
  personalInfo: string;
  accountType: string;
  purpose: string;
  painPoints: string;
  characterDesign: string;
  targetAudience: string;
  createTime: string | null;
  updateTime: string | null;
}

const ExamplePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>('ip');
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState<IpAnalysisResult | null>(null);

  const handleBusinessTypeChange = (e: RadioChangeEvent) => {
    setBusinessType(e.target.value);
    form.resetFields();
    setAnalysisResult(null);
  };

  const handleSubmit = async (values: IpFormData | ProductFormData) => {
    try {
      setLoading(true);
      const endpoint = businessType === 'ip' ? '/business/ip' : '/business/product';
      const response = await request.post(endpoint, values);
      
      // 直接从响应中获取分析结果
      if (businessType === 'ip' && response.data && response.data.code === 0 && response.data.data) {
        setAnalysisResult(response.data.data);
        message.success('提交成功，已获取分析结果');
      } else {
        message.success('提交成功');
        setAnalysisResult(null);
      }
      
      form.resetFields();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 将带有格式的文本转换为React组件
  const renderFormattedText = (text: string) => {
    if (!text) return <Paragraph>暂无数据</Paragraph>;

    // 分割文本为行
    return text.split('\n').map((line, index) => {
      // 检查是否是带有 "- " 的列表项
      if (line.trim().startsWith('-')) {
        return (
          <Paragraph key={index} style={{ marginLeft: '20px' }}>
            • {line.trim().substring(1).trim()}
          </Paragraph>
        );
      }
      
      // 检查是否是带有 ":" 的标题
      if (line.includes(':')) {
        const [title, content] = line.split(':');
        return (
          <div key={index} style={{ marginBottom: '8px' }}>
            <Text strong>{title.trim()}</Text>
            {content && <Paragraph>{content.trim()}</Paragraph>}
          </div>
        );
      }
      
      return <Paragraph key={index}>{line}</Paragraph>;
    });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="痛点分析">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="业务类型" required>
            <Radio.Group value={businessType} onChange={handleBusinessTypeChange}>
              <Radio.Button value="ip">做IP</Radio.Button>
              <Radio.Button value="product">带货</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {businessType === 'ip' ? (
            <>
              <Form.Item
                label="个人信息"
                name="personalInfo"
                rules={[{ required: true, message: '请输入个人信息' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="账号类型"
                name="accountType"
                rules={[{ required: true, message: '请输入账号类型' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="目的"
                name="purpose"
                rules={[{ required: true, message: '请输入目的' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="产品信息"
                name="productInfo"
                rules={[{ required: true, message: '请输入产品信息' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="补充信息"
                name="additionalInfo"
                rules={[{ required: true, message: '请输入补充信息' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 分析结果展示区域 */}
      {loading && businessType === 'ip' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Spin size="large" tip="分析中..." />
        </div>
      )}

      {analysisResult && (
        <Card title="痛点分析结果" style={{ marginTop: '20px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="基本信息" bordered={false} size="small">
                <Paragraph><Text strong>个人信息：</Text> {analysisResult.personalInfo || '暂无数据'}</Paragraph>
                <Paragraph><Text strong>账号类型：</Text> {analysisResult.accountType || '暂无数据'}</Paragraph>
                <Paragraph><Text strong>目的：</Text> {analysisResult.purpose || '暂无数据'}</Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="目标受众" bordered={false} size="small">
                {renderFormattedText(analysisResult.targetAudience)}
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card title="痛点分析" bordered={false} size="small">
                {analysisResult.painPoints ? renderFormattedText(analysisResult.painPoints) : <Paragraph>暂无数据</Paragraph>}
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card title="角色设计" bordered={false} size="small">
                {renderFormattedText(analysisResult.characterDesign)}
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </Space>
  );
};

export default ExamplePage;