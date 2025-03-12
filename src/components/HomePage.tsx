import React from 'react';
import {Typography, Card, Row, Col} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/example');
  };

  const handleContentGeneration = () => {
    navigate('/content');
  };

  const handleTitleGeneration = () => {
    navigate('/title');
  };

  const handleScriptGeneration = () => {
    navigate('/script');
  };

  return (
    <div 
      style={{ 
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {/* 顶部波浪装饰 */}
      <div 
        style={{
          width: '100%',
          height: '150px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0 0 50% 50% / 0 0 100px 100px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <Title style={{ color: 'white', margin: '0', fontSize: '2.5rem' }}>AI内容助手</Title>
          <Paragraph style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: '10px 0 0 0' }}>
            智能创作，让内容创作更简单高效
          </Paragraph>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        padding: '0 20px 40px',
        boxSizing: 'border-box',
      }}>
        {/* 功能介绍 */}
        <div style={{ textAlign: 'center', margin: '20px 0 40px' }}>
          <Title level={2} style={{ fontSize: '1.8rem' }}>一站式AI内容创作平台</Title>
          <Paragraph style={{ 
            fontSize: '1.1rem', 
            maxWidth: '800px', 
            margin: '0 auto',
            color: '#555'
          }}>
            我们的AI助手可以帮助您生成高质量的文案、标题和脚本，提升内容创作效率
          </Paragraph>
        </div>

        {/* 功能卡片区域 */}
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleContentGeneration}
              style={{ 
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              cover={
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>✍️</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>内容生成</span>}
                description={<span style={{ fontSize: '0.95rem' }}>使用AI助手优化您的文案，提升内容质量</span>}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleTitleGeneration}
              style={{ 
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              cover={
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>🔥</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>爆款标题</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成吸引人的爆款标题，提高内容点击率</span>}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleScriptGeneration}
              style={{ 
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              cover={
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>🎬</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>脚本生成</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成高质量脚本内容，适用于视频、直播等场景</span>}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleExplore}
              style={{ 
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              cover={
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>🔍</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>痛点分析</span>}
                description={<span style={{ fontSize: '0.95rem' }}>深入分析用户痛点，提供针对性解决方案</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* 底部信息 */}
        <div style={{ 
          marginTop: '60px', 
          textAlign: 'center',
          padding: '20px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        }}>
          <Title level={4} style={{ margin: '0 0 10px 0', color: '#555' }}>开始使用AI内容助手</Title>
          <Paragraph style={{ color: '#666' }}>
            点击上方任意卡片，立即体验AI内容创作的魔力
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default HomePage;