import request from '../utils/request';

// 套餐类型定义
export interface PointsPackage {
  id: number;
  name: string;
  pointsAmount: number;
  price: number;
  discountPrice: number;
  description: string;
  status: number;
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

// 订单类型定义
export interface PaymentOrder {
  orderNo: string;
  packageName: string;
  pointsAmount: number;
  payAmount: number;
  paymentType: number; // 1-支付宝，2-微信支付
  paymentUrl: string;
  createTime: string;
}

// 订单状态类型定义
export interface OrderStatus {
  orderNo: string;
  status: number; // 0-待支付，1-支付成功，2-支付失败，3-已取消
}

// 获取积分套餐列表
export const getPointsPackages = (): Promise<PointsPackage[]> => {
  return request.get('/payment/packages')
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分套餐列表失败');
    });
};

// 创建支付订单
export const createPaymentOrder = (
  data: {
    packageId: number;
    paymentType: number; // 1-支付宝，2-微信支付
  }
): Promise<PaymentOrder> => {
  return request.post('/payment/order', data)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '创建支付订单失败');
    });
};

// 查询订单支付状态
export const getOrderStatus = (orderNo: string): Promise<OrderStatus> => {
  return request.get(`/payment/order/status?orderNo=${orderNo}`)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '查询订单状态失败');
    });
};

// 取消订单
export const cancelOrder = (orderNo: string): Promise<boolean> => {
  return request.post(`/payment/order/cancel?orderNo=${orderNo}`)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '取消订单失败');
    });
};
