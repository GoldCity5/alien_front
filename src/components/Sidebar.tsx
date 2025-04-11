import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  // 可以添加任何需要的props
}

const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // 导航到媒体档案生成页面（专属方案）
  const handleMediaProfileGeneration = () => {
    navigate('/media-profile');
  };

  // 导航到首页
  const handleHome = () => {
    navigate('/');
  };

  // 导航到对标分析页面
  const handleAnalysis = () => {
    // 导航到对标分析页面
    navigate('/analytics');
  };

  // 导航到创作工具页面
  const handleCreationTools = () => {
    // 导航到创作工具页面
    navigate('/creative-tools');
  };

  return (
    <div className="sidebar">
      <div 
        className="sidebar-item sidebar-special" 
        onClick={handleMediaProfileGeneration}
      >
        <i className="plus-icon">＋</i>
        <span>专属方案</span>
      </div>
      <div 
        className={`sidebar-item ${currentPath === '/' ? 'active' : ''}`} 
        onClick={handleHome}
      >
        <i>🏠</i>
        <span>首页</span>
      </div>
      <div 
        className={`sidebar-item ${currentPath === '/analytics' ? 'active' : ''}`} 
        onClick={handleAnalysis}
      >
        <i>📊</i>
        <span>对标分析</span>
      </div>
      <div 
        className={`sidebar-item ${currentPath === '/creative-tools' ? 'active' : ''}`} 
        onClick={handleCreationTools}
      >
        <i>🔧</i>
        <span>创作工具</span>
      </div>
    </div>
  );
};

export default Sidebar; 