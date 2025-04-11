import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreativeToolsPage.css';

/**
 * 创作工具页面组件
 * 提供多种创作工具和功能，帮助用户提升创作效率和质量
 */
const CreativeToolsPage: React.FC = () => {
  const navigate = useNavigate();

  // 导航到内容生成页面
  const handleContentGeneration = () => {
    navigate('/content');
  };

  // 导航到爆款标题页面
  const handleTitleGeneration = () => {
    navigate('/title');
  };

  // 导航到脚本生成页面
  const handleScriptGeneration = () => {
    navigate('/script');
  };

  // 导航到更多工具页面
  const handleMoreTools = () => {
    navigate('/');
  };

  return (
    <div className="creative-tools-container">
      <div className="main-content">
        <div className="content-wrapper">
          {/* 页面标题 */}
          <div className="page-title">创作工具</div>
          <div className="page-subtitle">
            让AI为您的创作之旅赋能，轻松生成优质内容，提升创作效率
          </div>
        
          <div className="tools-section">
            {/* 内容生成 */}
            <div 
              className="tool-card content-card"
              onClick={handleContentGeneration}
            >
              <div className="tool-card-content">
                <div className="tool-icon">✍️</div>
                <div className="tool-info">
                  <div className="tool-title">内容生成</div>
                  <div className="tool-description">
                    一键智能创作，让灵感自由流动。告别写作瓶颈，轻松生成原创内容，提升文案质量，满足各类创作需求。
                  </div>
                </div>
              </div>
            </div>

            {/* 爆款标题 */}
            <div 
              className="tool-card title-card"
              onClick={handleTitleGeneration}
            >
              <div className="tool-card-content">
                <div className="tool-icon">🔥</div>
                <div className="tool-info">
                  <div className="tool-title">爆款标题</div>
                  <div className="tool-description">
                    捕获读者眼球，引爆阅读热情。智能分析热点趋势，生成高点击率标题，让您的内容在信息海洋中脱颖而出。
                  </div>
                </div>
              </div>
            </div>

            {/* 脚本生成 */}
            <div 
              className="tool-card script-card"
              onClick={handleScriptGeneration}
            >
              <div className="tool-card-content">
                <div className="tool-icon">📝</div>
                <div className="tool-info">
                  <div className="tool-title">脚本生成</div>
                  <div className="tool-description">
                    轻松打造专业剧本，让视频创作如行云流水。从短视频到直播，量身定制脚本内容，提升观众参与度与转化率。
                  </div>
                </div>
              </div>
            </div>

            {/* 探索更多 */}
            <div 
              className="tool-card more-card"
              onClick={handleMoreTools}
            >
              <div className="tool-card-content">
                <div className="tool-icon">🔍</div>
                <div className="tool-info">
                  <div className="tool-title">探索更多</div>
                  <div className="tool-description">
                    挖掘更多创作宝藏，解锁无限可能。持续更新的AI工具库，助您全方位提升创作效率，开启创意无限可能。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeToolsPage; 