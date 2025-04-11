import React from 'react';
import { message } from 'antd';
import './AnalyticsPage.css';

/**
 * 对标分析页面组件
 * 提供账号分析、视频分析、痛点分析和卖点分析等功能
 */
const AnalyticsPage: React.FC = () => {
  
  // 处理分析卡片点击
  const handleCardClick = (title: string) => {
    message.info(`${title}功能即将上线，敬请期待！`);
  };

  return (
    <div className="analytics-container">
      <div className="main-content">
        <div className="content-wrapper">
          {/* 页面标题 */}
          <div className="page-title">对标分析</div>
          
          {/* 分析卡片区域 */}
          <div className="analysis-cards">
            {/* 账号分析卡片 */}
            <div 
              className="analysis-card account" 
              onClick={() => handleCardClick('账号分析')}
            >
              <div className="analysis-icon">
                <span>👤</span>
              </div>
              <div className="analysis-content">
                <div className="analysis-title">账号分析</div>
                <div className="analysis-description">
                  深入分析账号数据，了解粉丝画像、增长趋势和互动表现，助您精准定位账号发展方向。
                </div>
              </div>
            </div>

            {/* 视频分析卡片 */}
            <div 
              className="analysis-card video" 
              onClick={() => handleCardClick('视频分析')}
            >
              <div className="analysis-icon">
                <span>🎬</span>
              </div>
              <div className="analysis-content">
                <div className="analysis-title">视频分析</div>
                <div className="analysis-description">
                  解析视频内容表现，包括播放量、完播率、互动率等核心指标，发现爆款视频规律。
                </div>
              </div>
            </div>

            {/* 痛点分析卡片 */}
            <div 
              className="analysis-card pain" 
              onClick={() => handleCardClick('痛点分析')}
            >
              <div className="analysis-icon">
                <span>💡</span>
              </div>
              <div className="analysis-content">
                <div className="analysis-title">痛点分析</div>
                <div className="analysis-description">
                  挖掘目标用户痛点需求，寻找内容创作突破口，让您的内容直击用户核心关注点。
                </div>
              </div>
            </div>

            {/* 卖点分析卡片 */}
            <div 
              className="analysis-card selling" 
              onClick={() => handleCardClick('卖点分析')}
            >
              <div className="analysis-icon">
                <span>🔍</span>
              </div>
              <div className="analysis-content">
                <div className="analysis-title">卖点分析</div>
                <div className="analysis-description">
                  分析竞品热门内容卖点，明确差异化竞争优势，打造独特内容价值主张和吸引力。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 