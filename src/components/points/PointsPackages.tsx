import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Button, Modal, Radio, Spin, message, Tag, Divider, Space } from 'antd';
import { ShoppingCartOutlined, WalletOutlined, AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { getPointsPackages, createPaymentOrder, getOrderStatus, cancelOrder, PointsPackage, PaymentOrder } from '../../services/paymentService';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;
const { Group: RadioGroup } = Radio;

interface PointsPackagesProps {
  onPaymentSuccess?: () => void;
}

const PointsPackages: React.FC<PointsPackagesProps> = ({ onPaymentSuccess }) => {
  const [packages, setPackages] = useState<PointsPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PointsPackage | null>(null);
  const [paymentType, setPaymentType] = useState<number>(1); // 默认支付宝
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(null);
  const [orderPolling, setOrderPolling] = useState<ReturnType<typeof setInterval> | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 获取套餐列表
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getPointsPackages();
      setPackages(data);
    } catch (err: any) {
      message.error(err.message || '获取积分套餐失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    return () => {
      // 清理轮询
      if (orderPolling) {
        clearInterval(orderPolling);
      }
    };
  }, []);

  // 选择套餐
  const handleSelectPackage = (pkg: PointsPackage) => {
    setSelectedPackage(pkg);
    setPaymentModalVisible(true);
  };

  // 切换支付方式
  const handlePaymentTypeChange = (e: any) => {
    setPaymentType(e.target.value);
  };

  // 创建订单
  const handleCreateOrder = async () => {
    if (!selectedPackage) return;

    setOrderCreating(true);
    try {
      const orderData = await createPaymentOrder({
        packageId: selectedPackage.id,
        paymentType: paymentType
      });
      setCurrentOrder(orderData);
      
      // 开始轮询订单状态
      startOrderStatusPolling(orderData.orderNo);
    } catch (err: any) {
      message.error(err.message || '创建订单失败');
    } finally {
      setOrderCreating(false);
    }
  };

  // 轮询订单状态
  const startOrderStatusPolling = (orderNo: string) => {
    // 清除之前的轮询
    if (orderPolling) {
      clearInterval(orderPolling);
    }

    // 每3秒查询一次订单状态
    const polling = setInterval(async () => {
      try {
        const statusData = await getOrderStatus(orderNo);
        
        // 如果支付成功
        if (statusData.status === 1) {
          clearInterval(polling);
          setOrderPolling(null);
          setPaymentSuccess(true);
          message.success('支付成功！');
          
          // 调用父组件传入的成功回调
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
          
          // 关闭支付弹窗
          setTimeout(() => {
            setPaymentModalVisible(false);
            setCurrentOrder(null);
            setPaymentSuccess(false);
          }, 2000);
        } 
        // 如果支付失败或取消
        else if (statusData.status === 2 || statusData.status === 3) {
          clearInterval(polling);
          setOrderPolling(null);
          message.error('支付失败或已取消');
        }
      } catch (err) {
        console.error('查询订单状态失败:', err);
      }
    }, 3000);

    setOrderPolling(polling);
  };

  // 取消订单
  const handleCancelOrder = async () => {
    if (!currentOrder) return;

    try {
      await cancelOrder(currentOrder.orderNo);
      message.success('订单已取消');
      
      // 清除轮询
      if (orderPolling) {
        clearInterval(orderPolling);
        setOrderPolling(null);
      }
      
      setCurrentOrder(null);
      setPaymentModalVisible(false);
    } catch (err: any) {
      message.error(err.message || '取消订单失败');
    }
  };

  // 关闭支付弹窗
  const handleClosePaymentModal = () => {
    // 如果有进行中的订单，先取消
    if (currentOrder && !paymentSuccess) {
      handleCancelOrder();
    } else {
      setPaymentModalVisible(false);
      setCurrentOrder(null);
      setPaymentSuccess(false);
      
      // 清除轮询
      if (orderPolling) {
        clearInterval(orderPolling);
        setOrderPolling(null);
      }
    }
  };

  // 渲染支付内容
  const renderPaymentContent = () => {
    if (orderCreating) {
      return (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>正在创建订单，请稍候...</p>
        </div>
      );
    }

    if (currentOrder) {
      if (paymentSuccess) {
        return (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '72px', color: '#52c41a', marginBottom: '16px' }}>✓</div>
            <Title level={4}>支付成功</Title>
            <Paragraph>
              您已成功购买 <Text strong>{currentOrder.packageName}</Text>，
              获得 <Text strong>{currentOrder.pointsAmount}</Text> 积分
            </Paragraph>
          </div>
        );
      }

      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={4}>请扫码支付</Title>
          <Paragraph>
            <Text strong>订单号：</Text> {currentOrder.orderNo}
          </Paragraph>
          <Paragraph>
            <Text strong>套餐：</Text> {currentOrder.packageName} ({currentOrder.pointsAmount}积分)
          </Paragraph>
          <Paragraph>
            <Text strong>金额：</Text> <Text type="danger">¥{currentOrder.payAmount.toFixed(2)}</Text>
          </Paragraph>
          
          <div style={{ margin: '20px 0', background: '#f5f5f5', padding: '20px', borderRadius: '4px' }}>
            {paymentType === 1 ? (
              <>
                <div style={{ marginBottom: '10px' }}><AlipayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> 支付宝支付</div>
                <a href={currentOrder.paymentUrl} target="_blank" rel="noopener noreferrer">
                  <Button type="primary" size="large">
                    前往支付宝付款
                  </Button>
                </a>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '10px' }}><WechatOutlined style={{ fontSize: '24px', color: '#52c41a' }} /> 微信支付</div>
                <QRCodeSVG value={currentOrder.paymentUrl} size={200} />
                <p style={{ marginTop: '10px' }}>请使用微信扫描二维码支付</p>
              </>
            )}
          </div>
          
          <Paragraph type="secondary" style={{ marginTop: '20px' }}>
            <small>支付完成后，系统将自动为您充值积分</small>
          </Paragraph>
        </div>
      );
    }

    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>选择支付方式</Title>
          <RadioGroup onChange={handlePaymentTypeChange} value={paymentType}>
            <Space direction="vertical">
              <Radio value={1}>
                <Space>
                  <AlipayCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                  <span>支付宝</span>
                </Space>
              </Radio>
              <Radio value={2}>
                <Space>
                  <WechatOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                  <span>微信支付</span>
                </Space>
              </Radio>
            </Space>
          </RadioGroup>
        </div>
        
        {selectedPackage && (
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
            <Title level={5}>订单信息</Title>
            <p><Text strong>套餐名称：</Text> {selectedPackage.name}</p>
            <p><Text strong>积分数量：</Text> {selectedPackage.pointsAmount}</p>
            <p>
              <Text strong>支付金额：</Text> 
              <Text delete style={{ marginRight: '8px' }}>¥{selectedPackage.price.toFixed(2)}</Text>
              <Text type="danger">¥{selectedPackage.discountPrice.toFixed(2)}</Text>
            </p>
          </div>
        )}
        
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleCreateOrder}
            loading={orderCreating}
          >
            确认支付
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {packages.map(pkg => (
            <Col xs={24} sm={12} md={8} key={pkg.id}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => handleSelectPackage(pkg)}
                  >
                    立即购买
                  </Button>
                ]}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Title level={4}>{pkg.name}</Title>
                  {pkg.discountPrice < pkg.price && (
                    <Tag color="red">优惠</Tag>
                  )}
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                    <WalletOutlined /> {pkg.pointsAmount}
                  </Title>
                  <Text type="secondary">积分</Text>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: '12px', textDecoration: 'line-through' }}>
                    原价: ¥{pkg.price.toFixed(2)}
                  </Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{pkg.discountPrice.toFixed(2)}
                  </Text>
                </div>
                
                <Paragraph 
                  type="secondary" 
                  style={{ 
                    marginTop: '16px', 
                    height: '40px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}
                >
                  {pkg.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title="购买积分套餐"
        open={paymentModalVisible}
        onCancel={handleClosePaymentModal}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={500}
      >
        {renderPaymentContent()}
      </Modal>
    </div>
  );
};

export default PointsPackages;
