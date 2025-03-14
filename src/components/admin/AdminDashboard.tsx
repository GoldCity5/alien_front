import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Breadcrumb, Card, Statistic, Row, Col, Dropdown, Button } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined, 
  FileTextOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  TeamOutlined,
  FileAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { getAdminInfo } from '../../services/adminService';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    fetchAdminInfo();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const response = await getAdminInfo();
      if (response?.data?.code === 200) {
        setAdminInfo(response.data.data);
      }
    } catch (error) {
      console.error('获取管理员信息失败:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminNickname');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/admin/profile">个人信息</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/admin/settings">系统设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 根据当前路径获取面包屑项
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
      { title: '首页', path: '/admin/dashboard' }
    ];
    
    let path = '';
    pathSnippets.forEach((snippet, index) => {
      if (index >= 1) { // 跳过 'admin'
        path += `/${snippet}`;
        const title = getBreadcrumbTitle(snippet);
        breadcrumbItems.push({
          title,
          path: `/admin${path}`
        });
      }
    });
    
    return breadcrumbItems;
  };
  
  // 获取面包屑标题
  const getBreadcrumbTitle = (path: string) => {
    const titles: Record<string, string> = {
      'dashboard': '仪表盘',
      'profile': '个人信息',
      'settings': '系统设置',
      'users': '用户管理',
      'content': '内容管理',
      'prompt': '提示词管理'
    };
    
    return titles[path] || path;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '18px',
          background: '#1a1a1a'
        }}>
          {collapsed ? 'AI' : 'AI管理后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">仪表盘</Link>
          </Menu.Item>
          <Menu.Item key="/admin/users" icon={<TeamOutlined />}>
            <Link to="/admin/users">用户管理</Link>
          </Menu.Item>
          <Menu.Item key="/admin/content" icon={<FileTextOutlined />}>
            <Link to="/admin/content">内容管理</Link>
          </Menu.Item>
          <Menu.Item key="/admin/prompt" icon={<FormOutlined />}>
            <Link to="/admin/prompt">提示词管理</Link>
          </Menu.Item>
          <Menu.Item key="/admin/settings" icon={<SettingOutlined />}>
            <Link to="/admin/settings">系统设置</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? (isMobile ? 0 : 80) : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <span style={{ marginLeft: 8, display: isMobile ? 'none' : 'inline' }}>
                {adminInfo?.nickname || localStorage.getItem('adminNickname') || '管理员'}
              </span>
            </div>
          </Dropdown>
        </Header>
        
        <Content style={{ margin: '16px', overflow: 'initial', minHeight: 'calc(100vh - 64px - 32px)' }}>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            {getBreadcrumbItems().map((item, index) => (
              <Breadcrumb.Item key={index}>
                {index < getBreadcrumbItems().length - 1 ? (
                  <Link to={item.path}>{item.title}</Link>
                ) : (
                  item.title
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          
          {location.pathname === '/admin/dashboard' ? (
            <div>
              <Title level={2} style={{ marginBottom: 24 }}>仪表盘</Title>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Statistic
                      title="用户总数"
                      value={1256}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Statistic
                      title="内容总数"
                      value={3218}
                      prefix={<FileTextOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Statistic
                      title="今日新增用户"
                      value={26}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Statistic
                      title="今日新增内容"
                      value={128}
                      prefix={<FileAddOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="系统公告" style={{ height: 300 }}>
                    <p>欢迎使用AI内容创作平台管理系统</p>
                    <p>当前版本: v1.0.0</p>
                    <p>上次更新: 2025-03-13</p>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
