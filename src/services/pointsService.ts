import request from '../utils/request';

// Types
export interface UserPointsInfo {
  userId: number;
  totalPoints: number;
}

export interface PointsTransaction {
  id: number;
  userId: number;
  amount: number;
  type: number; // 1-充值，2-消费
  featureName: string | null;
  description: string;
  createTime: string;
}

export interface PointsTransactionPage {
  records: PointsTransaction[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface UserPointsItem {
  id: number;
  userId: number;
  totalPoints: number;
  createTime: string;
  updateTime: string;
}

export interface UserPointsPage {
  records: UserPointsItem[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface FeaturePointsConfig {
  id: number;
  featureKey: string;
  featureName: string;
  pointCost: number;
  status: number; // 1-启用，0-禁用
  createTime?: string;
  updateTime?: string;
}

// 积分套餐类型定义
export interface PointsPackage {
  id: number;
  name: string;
  pointsAmount: number;
  price: number;
  discountPrice: number;
  description: string;
  status: number; // 1-启用，0-禁用
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

export interface PointsPackagePage {
  records: PointsPackage[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// User API calls
export const getUserPointsInfo = (): Promise<UserPointsInfo> => {
  return request.get('/user/points/info')
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分信息失败');
    });
};

export const getUserPointsTransactions = (
  params: {
    page?: number;
    size?: number;
    type?: number;
  } = {}
): Promise<PointsTransactionPage> => {
  return request.get('/user/points/transactions', { params })
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分交易记录失败');
    });
};

// Admin API calls
export const getAdminUserPointsList = (
  params: {
    page?: number;
    size?: number;
  } = {}
): Promise<UserPointsPage> => {
  return request.get('/admin/points/users', { params })
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取用户积分列表失败');
    });
};

export const getAdminPointsTransactions = (
  params: {
    page?: number;
    size?: number;
    userId?: number;
    type?: number;
  } = {}
): Promise<PointsTransactionPage> => {
  return request.get('/admin/points/transactions', { params })
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分交易记录失败');
    });
};

export const getFeaturePointsConfigs = (): Promise<FeaturePointsConfig[]> => {
  return request.get('/admin/points/features')
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取功能积分配置失败');
    });
};

export const updateFeaturePointsConfig = (
  id: number,
  data: {
    featureKey: string;
    featureName: string;
    pointCost: number;
    status: number;
  }
): Promise<void> => {
  return request.put(`/admin/points/features/${id}`, data)
    .then(response => {
      if (response.data.code !== 0) {
        throw new Error(response.data.message || '更新功能积分配置失败');
      }
    });
};

export const addFeaturePointsConfig = (
  data: {
    featureKey: string;
    featureName: string;
    pointCost: number;
    status: number;
  }
): Promise<FeaturePointsConfig> => {
  return request.post('/admin/points/features', data)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '添加功能积分配置失败');
    });
};

export const rechargeUserPoints = (
  data: {
    userId: number;
    amount: number;
    description?: string;
  }
): Promise<{ userId: number; totalPoints: number }> => {
  return request.post('/admin/points/recharge', data)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '充值积分失败');
    });
};

// 积分套餐管理 API 调用
export const getPointsPackages = (
  params: {
    page?: number;
    size?: number;
  } = {}
): Promise<PointsPackagePage> => {
  return request.get('/admin/points-packages', { params })
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分套餐列表失败');
    });
};

export const getPointsPackageDetail = (id: number): Promise<PointsPackage> => {
  return request.get(`/admin/points-packages/${id}`)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '获取积分套餐详情失败');
    });
};

export const createPointsPackage = (
  data: {
    name: string;
    pointsAmount: number;
    price: number;
    discountPrice: number;
    description: string;
    status: number;
    sortOrder: number;
  }
): Promise<PointsPackage> => {
  return request.post('/admin/points-packages', data)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '创建积分套餐失败');
    });
};

export const updatePointsPackage = (
  id: number,
  data: {
    name: string;
    pointsAmount: number;
    price: number;
    discountPrice: number;
    description: string;
    status: number;
    sortOrder: number;
  }
): Promise<string> => {
  return request.put(`/admin/points-packages/${id}`, data)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '更新积分套餐失败');
    });
};

export const updatePointsPackageStatus = (
  id: number,
  status: number
): Promise<string> => {
  return request.put(`/admin/points-packages/${id}/status`, null, { params: { status } })
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '更新积分套餐状态失败');
    });
};

export const deletePointsPackage = (id: number): Promise<string> => {
  return request.delete(`/admin/points-packages/${id}`)
    .then(response => {
      if (response.data.code === 0) {
        return response.data.data;
      }
      throw new Error(response.data.message || '删除积分套餐失败');
    });
};
