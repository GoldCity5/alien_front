import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Button, Avatar, Space, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, HomeOutlined, FileTextOutlined, FormOutlined, VideoCameraOutlined, LogoutOutlined, MenuOutlined, GithubOutlined } from '@ant-design/icons';
import ExamplePage from './components/ExamplePage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ContentGenerationPage from './components/ContentGenerationPage';
import TitleGenerationPage from './components/TitleGenerationPage';
import ScriptGenerationPage from './components/ScriptGenerationPage';
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
      {!isMobile && localStorage.getItem('token') && (
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
      {!isMobile && localStorage.getItem('token') && (
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
      {isMobile && localStorage.getItem('token') && (
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

function App() {
  return (
    <Router>
      <Layout style={{ 
        width: '100vw', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Routes>
          <Route path="*" element={<AppHeader />} />
        </Routes>
        <Content style={{ 
          flex: 1,
          width: '100%',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              localStorage.getItem('token') ? <HomePage /> : <Navigate to="/login" />
            } />
            <Route path="/example" element={
              localStorage.getItem('token') ? <ExamplePage /> : <Navigate to="/login" />
            } />
            <Route path="/content" element={
              localStorage.getItem('token') ? <ContentGenerationPage /> : <Navigate to="/login" />
            } />
            <Route path="/title" element={
              localStorage.getItem('token') ? <TitleGenerationPage /> : <Navigate to="/login" />
            } />
            <Route path="/script" element={
              localStorage.getItem('token') ? <ScriptGenerationPage /> : <Navigate to="/login" />
            } />
          </Routes>
        </Content>
        <AppFooter />
      </Layout>
    </Router>
  );
}

export default App;
