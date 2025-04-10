import React, { useState } from 'react';
import {Typography, Card, Row, Col, Modal, Button} from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMediaProfiles } from '../services/mediaProfileService';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleMediaProfileGeneration = async () => {
    setLoading(true);
    try {
      const response = await getMediaProfiles();
      const profilesData = response.data.data || [];
      
      if (profilesData.length === 0) {
        // 没有档案，显示提示弹窗
        setProfileModalVisible(true);
      } else {
        // 有档案，直接跳转到策划方案页面
        navigate('/media-profile');
      }
    } catch (error) {
      console.error('获取档案列表失败:', error);
      // 出错时也跳转到档案页面，让用户在那里处理
      navigate('/media-profile');
    } finally {
      setLoading(false);
    }
  };

  const handleContentTopicGeneration = () => {
    navigate('/content-topic');
  };

  const handleCreateProfile = () => {
    setProfileModalVisible(false);
    navigate('/media-profile');
  };

  const handleMediaContentGeneration = () => {
    navigate('/media-content');
  };

  const handleMediaIntroductionGeneration = () => {
    navigate('/media-introduction');
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

      {/* 特色功能模块 */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '0 20px',
        marginBottom: '30px',
      }}>
        {/* 自媒体策划方案卡片 */}
        <Card
          hoverable
          onClick={handleMediaProfileGeneration}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
          }}>
            <div style={{ color: 'white' }}>
              <Title level={3} style={{ color: 'white', margin: '0' }}>生成我的专属自媒体策划方案</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '10px 0 0 0' }}>
                基于您的个人特点和目标，量身定制专业的自媒体发展策略
              </Paragraph>
            </div>
            <div style={{
              fontSize: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              🚀
            </div>
          </div>
        </Card>
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
                  background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>📝</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>脚本生成</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成专业的视频脚本，提高内容质量</span>}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleContentTopicGeneration}
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
                  <span style={{ fontSize: '64px' }}>💡</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>选题生成</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成热门内容选题，紧跟市场热点</span>}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleMediaContentGeneration}
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
                  background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>📱</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>自媒体文案</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成平台专属文案，提升内容传播效果</span>}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleMediaIntroductionGeneration}
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
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '64px' }}>📝</span>
                </div>
              }
              bodyStyle={{ padding: '20px' }}
            >
              <Card.Meta
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>自媒体简介</span>}
                description={<span style={{ fontSize: '0.95rem' }}>生成专业账号简介，提升账号专业度和吸引力</span>}
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
                title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>探索更多</span>}
                description={<span style={{ fontSize: '0.95rem' }}>探索更多AI内容创作功能和案例</span>}
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

      {/* 没有档案时的提示弹窗 */}
      <Modal
        title="提示"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleCreateProfile}>
            写档案
          </Button>
        ]}
      >
        <p>去填写您的个人档案，让"天天"为您生成专属自媒体策划方案</p>
      </Modal>
    </div>
  );
};

export default HomePage;