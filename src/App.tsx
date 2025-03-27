import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Button, Avatar, Space, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, HomeOutlined, FileTextOutlined, FormOutlined, VideoCameraOutlined, LogoutOutlined, MenuOutlined, GithubOutlined, BulbOutlined, MobileOutlined, ProfileOutlined, WalletOutlined } from '@ant-design/icons';
import ExamplePage from './components/ExamplePage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ContentGenerationPage from './components/ContentGenerationPage';
import TitleGenerationPage from './components/TitleGenerationPage';
import ScriptGenerationPage from './components/ScriptGenerationPage';
import MediaProfilePage from './components/mediaProfile/MediaProfilePage';
import ContentTopicPage from './components/ContentTopicPage';
import { MediaContentPage } from './components/mediaContent';
import { MediaIntroductionPage } from './components/mediaIntroduction';
import UserPointsPage from './components/points/UserPointsPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProfile from './components/admin/AdminProfile';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import SystemSettings from './components/admin/SystemSettings';
import PromptManagement from './components/admin/PromptManagement';
import PointsManagement from './components/admin/PointsManagement';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Text, Link: AntLink } = Typography;

// Header component with navigation
const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/content',
      icon: <FileTextOutlined />,
      label: '内容优化',
    },
    {
      key: '/title',
      icon: <FormOutlined />,
      label: '标题生成',
    },
    {
      key: '/script',
      icon: <VideoCameraOutlined />,
      label: '脚本生成',
    },
    {
      key: '/media-profile',
      icon: <UserOutlined />,
      label: '自媒体策划',
    },
    {
      key: '/content-topic',
      icon: <BulbOutlined />,
      label: '内容选题',
    },
    {
      key: '/media-content',
      icon: <MobileOutlined />,
      label: '自媒体文案',
    },
    {
      key: '/media-introduction',
      icon: <ProfileOutlined />,
      label: '自媒体简介',
    },
    {
      key: '/user-points',
      icon: <WalletOutlined />,
      label: '用户积分',
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <Menu>
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.key)}>
          {item.label}
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ 
      color: 'white', 
      fontSize: '18px',
      padding: '0 20px',
      background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      {/* Logo and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: 'bold',
        fontSize: '20px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a237e',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          AI
        </div>
        {!isMobile && (
          <span>AI内容创作平台</span>
        )}
      </div>
      
      {/* Navigation Menu - Desktop */}
      {!isMobile && localStorage.getItem('userToken') && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{ 
              background: 'transparent',
              borderBottom: 'none',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      )}
      
      {/* User Avatar - Desktop */}
      {!isMobile && localStorage.getItem('userToken') && (
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar 
            style={{ 
              backgroundColor: '#fff', 
              color: '#1a237e',
              cursor: 'pointer'
            }} 
            icon={<UserOutlined />} 
          />
        </Dropdown>
      )}
      
      {/* Mobile Menu */}
      {isMobile && localStorage.getItem('userToken') && (
        <Dropdown overlay={mobileMenu} placement="bottomRight" trigger={['click']}>
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            style={{ color: 'white', fontSize: '18px' }}
          />
        </Dropdown>
      )}
    </Header>
  );
};

// Footer component
const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Footer style={{ 
      textAlign: 'center', 
      background: '#f0f2f5',
      padding: '24px',
      borderTop: '1px solid #e8e8e8'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <Text strong>AI内容创作平台</Text> - <Text type="secondary">智能内容生成解决方案</Text>
      </div>
      <div>
        <Space split={<span style={{ margin: '0 8px' }}>|</span>}>
          <AntLink href="#" target="_blank">关于我们</AntLink>
          <AntLink href="#" target="_blank">使用指南</AntLink>
          <AntLink href="#" target="_blank">API文档</AntLink>
          <AntLink href="https://github.com" target="_blank">
            <GithubOutlined /> GitHub
          </AntLink>
        </Space>
      </div>
      <div style={{ marginTop: '16px' }}>
        <Text type="secondary"> {currentYear} AI内容创作平台. 保留所有权利.</Text>
      </div>
    </Footer>
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App 组件
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 管理员路由 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <HomePage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/example" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <ExamplePage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/content" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <ContentGenerationPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/title" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <TitleGenerationPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/script" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <ScriptGenerationPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-profile" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <MediaProfilePage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/content-topic" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <ContentTopicPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-content" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <MediaContentPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/media-introduction" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <MediaIntroductionPage />
              </UserProtectedRoute>
            </Content>
            <AppFooter />
          </Layout>
        } />
        <Route path="/user-points" element={
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
              <UserProtectedRoute>
                <UserPointsPage />
              </UserProtectedRoute>
            </Content>
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
