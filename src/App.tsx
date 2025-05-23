import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Button, Avatar, Space, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, MenuOutlined, GithubOutlined, WalletOutlined } from '@ant-design/icons';
import ExamplePage from './components/ExamplePage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ContentGenerationPage from './components/ContentGenerationPage';
import TitleGenerationPage from './components/TitleGenerationPage';
import ScriptGenerationPage from './components/ScriptGenerationPage';
import MediaProfilePage from './components/mediaProfile/MediaProfilePage';
import MediaProfileSidebar from './components/mediaProfile/MediaProfileSidebar';
import ContentTopicPage from './components/ContentTopicPage';
import { MediaContentPage } from './components/mediaContent';
import { MediaIntroductionPage } from './components/mediaIntroduction';
import UserPointsPage from './components/points/UserPointsPage';
import DouyinAnalysisPage from './components/douyin/DouyinAnalysisPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProfile from './components/admin/AdminProfile';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import SystemSettings from './components/admin/SystemSettings';
import PromptManagement from './components/admin/PromptManagement';
import PointsManagement from './components/admin/PointsManagement';
import CreativeToolsPage from './components/CreativeToolsPage';
import AnalyticsPage from './components/AnalyticsPage';
import Sidebar from './components/Sidebar';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { getUserPointsInfo } from './services/pointsService';
import './App.css';

const { Text, Link: AntLink } = Typography;

// Header component with navigation
const AppHeader = () => {
  useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userPoints, setUserPoints] = useState<number>(0);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取用户的积分信息
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (localStorage.getItem('userToken')) {
        try {
          const pointsData = await getUserPointsInfo();
          setUserPoints(pointsData.totalPoints);
        } catch (error) {
          console.error('获取积分信息失败:', error);
          // 如果API请求失败，保持现有积分不变
        }
      }
    };

    fetchUserPoints();
  }, []);

  /**
   * 处理用户登出操作
   * 清除本地存储中的token和用户积分，并导航到登录页面
   */
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userPoints'); // 清除积分数据
    navigate('/login');
    window.location.reload(); // 刷新页面以确保状态重置
  };

  /**
   * 处理积分点击事件
   * 导航到用户积分页面
   */
  const handlePointsClick = () => {
    navigate('/user-points');
  };

  

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/user-profile')}>
        个人中心
      </Menu.Item>
      <Menu.Item key="points" icon={<WalletOutlined />} onClick={handlePointsClick}>
        我的积分
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/user-profile')}>
        个人中心
      </Menu.Item>
      <Menu.Item key="points" icon={<WalletOutlined />} onClick={handlePointsClick}>
        我的积分
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className="navbar">
      <div className="navbar-container">
        {/* Logo和产品名称 */}
        <div className="logo" style={{ float: 'left', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-circle">
            <img src="/logo.svg" alt="小巷创意" className="logo-image" />
          </div>
          {!isMobile && (
            <div className="logo-text">小巷创意</div>
          )}
          {!isMobile && (
            <div className="sub-title">自媒体从来不是一件难事</div>
          )}
        </div>
        
        {/* 用户信息区域 */}
        {localStorage.getItem('userToken') && (
          <div className="user-info" style={{ float: 'right' }}>
            {/* 积分显示 - 可点击 */}
            <div className="points" onClick={handlePointsClick}>
              积分: {userPoints}
            </div>
            
            {/* 用户头像 - 桌面版 */}
            {!isMobile && (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div className="avatar-container">
                  <Avatar 
                    className="avatar"
                    icon={<UserOutlined style={{ color: '#66bb6a', fontSize: '20px' }} />}
                    style={{ backgroundColor: '#fff' }}
                  />
                </div>
              </Dropdown>
            )}
            
            {/* 移动端菜单 */}
            {isMobile && (
              <Dropdown overlay={mobileMenu} placement="bottomRight" trigger={['click']}>
                <Button 
                  type="text" 
                  icon={<MenuOutlined />} 
                  className="mobile-menu-button"
                />
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </Layout.Header>
  );
};

// Footer component
const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Layout.Footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Text strong>小巷创意</Text> - <Text type="secondary">AI内容创作平台</Text>
        </div>
        <div className="footer-links">
          <Space split={<span className="footer-divider">|</span>}>
            <AntLink href="#" target="_blank">关于我们</AntLink>
            <AntLink href="#" target="_blank">使用指南</AntLink>
            <AntLink href="#" target="_blank">API文档</AntLink>
            <AntLink href="https://github.com" target="_blank">
              <GithubOutlined /> GitHub
            </AntLink>
          </Space>
        </div>
        <div className="footer-copyright">
          <Text type="secondary">© {currentYear} 小巷创意. 保留所有权利.</Text>
        </div>
      </div>
    </Layout.Footer>
  );
};

// 管理员路由保护组件
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminToken') && localStorage.getItem('isAdmin') === 'true';
  
  console.log('AdminProtectedRoute check:', { 
    token: localStorage.getItem('adminToken'),
    isAdmin: localStorage.getItem('isAdmin'),
    isAuthenticated
  });
  
  if (!isAuthenticated) {
    console.log('AdminProtectedRoute: 认证失败，重定向到管理员登录页面');
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('AdminProtectedRoute: 认证成功，显示子组件');
  return <>{children}</>;
};

// 用户路由保护组件
const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('userToken');
  console.log('UserProtectedRoute: Checking auth, token is:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('UserProtectedRoute: No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('UserProtectedRoute: Token found, rendering children');
  return <>{children}</>;
};

// App 组件
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* 管理员路由 */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }>
          <Route path="dashboard" element={<></>} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="prompt" element={<PromptManagement />} />
          <Route path="points" element={<PointsManagement />} />
        </Route>
        
        {/* 用户路由 */}
        <Route path="/" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <HomePage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/example" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <ExamplePage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/content" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <ContentGenerationPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/title" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <TitleGenerationPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/script" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <ScriptGenerationPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-profile" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <MediaProfileSidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <MediaProfilePage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/content-topic" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <ContentTopicPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-content" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <MediaContentPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-introduction" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <MediaIntroductionPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        <Route path="/user-points" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <UserPointsPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        
        {/* 对标分析页面 */}
        <Route path="/analytics" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <AnalyticsPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        
        {/* 创作工具页面 */}
        <Route path="/creative-tools" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <CreativeToolsPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
       
        {/* 抖音分析页面 */}
        <Route path="/douyin-analysis" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <div className="page-container">
              <Sidebar />
              <div className="content-with-sidebar">
                <Layout.Content className="main-content-container">
                  <UserProtectedRoute>
                    <DouyinAnalysisPage />
                  </UserProtectedRoute>
                </Layout.Content>
              </div>
            </div>
            <AppFooter />
          </Layout>
        } />
        
        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
