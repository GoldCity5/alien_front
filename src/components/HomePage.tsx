import React, { useState, useEffect } from 'react';
import {Typography, Card, Row, Col, Modal, Button, Empty, Spin} from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMediaProfiles } from '../services/mediaProfileService';
import styles from './HomePage.module.css';
import { plazaProfiles, PlazaProfile } from '../data/plazaProfiles';

const { Title, Paragraph } = Typography;

// 定义媒体档案类型
interface MediaProfile {
  id: string;
  name: string;
  positions: string[];
  updateTime: string;
  followers: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 992 && window.innerWidth > 768);
  const [userProfiles, setUserProfiles] = useState<MediaProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PlazaProfile | null>(null);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);

  // 响应式布局调整
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 992 && window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取用户档案数据
  useEffect(() => {
    fetchUserProfiles();
  }, []);

  // 添加监听路由变化的副作用，确保从其他页面返回时刷新数据
  useEffect(() => {
    // 添加事件监听，检测页面获得焦点时刷新数据
    const handleFocus = () => {
      console.log('页面获得焦点，刷新数据');
      fetchUserProfiles();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // 返回清理函数
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 获取用户的媒体档案
  const fetchUserProfiles = async () => {
    setProfilesLoading(true);
    try {
      const response = await getMediaProfiles();
      console.log('API返回的原始数据:', response); // 添加调试信息
      const profilesData = response.data.data || [];
      console.log('提取的profilesData:', profilesData); // 添加调试信息
      
      // 将API返回的数据转换为需要的格式
      const profiles: MediaProfile[] = profilesData.map((profile: any) => {
        console.log('处理单个档案:', profile); // 添加调试信息
        
        // 尝试从不同可能的字段名中获取值
        const name = profile.name || profile.nickname || profile.username || profile.displayName || '未命名档案';
        
        // 处理职位信息，可能存在于不同字段中
        let positions: string[] = [];
        if (profile.positions && Array.isArray(profile.positions)) {
          positions = profile.positions;
        } else if (profile.occupation || profile.job || profile.title) {
          // 单个职位字段，可能需要分割或直接使用
          const positionText = profile.occupation || profile.job || profile.title;
          positions = [positionText];
        } else if (profile.jobTitle || profile.role) {
          positions = [profile.jobTitle || profile.role];
        }
        
        // 如果有职业特长字段，也添加到positions中
        if (profile.expertise) {
          positions.push(profile.expertise);
        }
        
        // 尝试获取更新时间，默认为"最近更新"
        const updateTime = profile.updateTime || profile.updatedAt || profile.lastModified || '最近更新';
        
        // 尝试获取粉丝数，各种可能的字段名
        const followers = profile.followers || profile.fansCount || profile.fanCount || profile.subscriberCount || 0;
        
        return {
          id: profile.id || profile._id || `temp-${Math.random()}`,
          name,
          positions,
          updateTime,
          followers
        };
      });
      
      console.log('转换后的profiles:', profiles); // 添加调试信息
      
      // 移除添加测试数据的逻辑，当API返回空数据时保持空数组
      setUserProfiles(profiles);
    } catch (error) {
      console.error('获取用户档案失败:', error);
      // 错误时也保持空数组，不添加测试数据
      setUserProfiles([]);
    } finally {
      setProfilesLoading(false);
    }
  };

  // 导航到示例页面
  const handleExplore = () => {
    navigate('/example');
  };

  // 导航到内容生成页面
  const handleContentGeneration = () => {
    navigate('/content');
  };

  // 导航到标题生成页面
  const handleTitleGeneration = () => {
    navigate('/title');
  };

  // 导航到脚本生成页面
  const handleScriptGeneration = () => {
    navigate('/script');
  };

  // 导航到媒体档案生成页面
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

  // 导航到自媒体简介生成页面
  const handleMediaIntroductionGeneration = () => {
    navigate('/media-introduction');
  };

  // 导航到自媒体内容文案生成页面
  const handleMediaContentGeneration = () => {
    navigate('/media-content');
  };

  // 导航到内容选题生成页面
  const handleContentTopicGeneration = () => {
    navigate('/content-topic');
  };

  // 导航到对标分析页面
  const handleAnalyticsPage = () => {
    navigate('/analytics');
  };

  // 导航到创作工具页面
  const handleCreativeToolsPage = () => {
    navigate('/creative-tools');
  };

  // 处理点击策划方案卡片
  const handlePlanCardClick = (planId: string) => {
    // 导航到自媒体策划方案页面，并传递profileId参数，确保方案可以显示
    navigate(`/media-profile?profileId=${planId}&showPlan=true&autoSelect=true`);
  };

  const handleCreateProfile = () => {
    setProfileModalVisible(false);
    navigate('/media-profile');
  };

  // 功能按钮hover处理函数
  const handleFeatureButtonMouseOver = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      let bgColor = 'rgba(102, 187, 106, 0.15)';
      if (type === 'purple') bgColor = 'rgba(126, 87, 194, 0.15)';
      if (type === 'orange') bgColor = 'rgba(255, 152, 0, 0.15)';
      if (type === 'blue') bgColor = 'rgba(66, 165, 245, 0.15)';
      icon.style.backgroundColor = bgColor;
      icon.style.transform = 'scale(1.05)';
    }
    const text = e.currentTarget.querySelector('span');
    if (text) {
      let color = 'var(--deep-green)';
      if (type === 'purple') color = 'var(--accent-purple)';
      if (type === 'orange') color = 'var(--accent-orange)';
      if (type === 'blue') color = 'var(--accent-blue)';
      text.style.color = color;
    }
  };

  // 功能按钮mouseout处理函数
  const handleFeatureButtonMouseOut = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      let bgColor = 'rgba(102, 187, 106, 0.08)';
      if (type === 'purple') bgColor = 'rgba(126, 87, 194, 0.08)';
      if (type === 'orange') bgColor = 'rgba(255, 152, 0, 0.08)';
      if (type === 'blue') bgColor = 'rgba(66, 165, 245, 0.08)';
      icon.style.backgroundColor = bgColor;
      icon.style.transform = 'scale(1)';
    }
    const text = e.currentTarget.querySelector('span');
    if (text) {
      text.style.color = '#333';
    }
  };

  // 获取卡片的颜色类型
  const getCardColorType = (index: number) => {
    const colorTypes = ['green', 'purple', 'orange', 'blue'];
    return colorTypes[index % colorTypes.length];
  };

  // 格式化粉丝数量
  const formatFollowersCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // 格式化更新时间为年月日格式
  const formatUpdateTime = (updateTime: string) => {
    // 如果是相对时间格式(如"2天前")，则转换为今天的日期减去相应天数
    if (updateTime.includes('天前')) {
      const days = parseInt(updateTime.replace(/[^0-9]/g, '')) || 0;
      const date = new Date();
      date.setDate(date.getDate() - days);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    
    // 如果是"最近更新"或其他非标准格式，返回今天的日期
    if (updateTime === '最近更新' || !updateTime.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/)) {
      const today = new Date();
      return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    }
    
    // 如果已经是日期格式，则直接返回
    return updateTime;
  };

  // 手动刷新用户档案数据
  const refreshUserProfiles = () => {
    fetchUserProfiles();
  };

  // 处理点击策划广场卡片
  const handlePlazaCardClick = (profile: PlazaProfile) => {
    setSelectedProfile(profile);
    setProfileDetailVisible(true);
  };

  // 关闭策划方案详情弹窗
  const handleProfileDetailClose = () => {
    setProfileDetailVisible(false);
    setSelectedProfile(null);
  };

  return (
    <div className={styles.page}>
      {/* 顶部模块区域 */}
      <div className={styles['page__top-area']}>
        <div className={styles['page__content-wrapper']}>
          <div className={styles.modules}>
            {/* 第一个特色模块 */}
            <div 
              className={`${styles.module} ${styles['module--green']}`}
              onClick={handleMediaProfileGeneration}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.07)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.03)';
              }}
            >
              <div className={`${styles['module__icon']} ${styles['module__icon--green']}`}>
                🚀
              </div>
              <div>
                <Title level={3} style={{ 
                  color: 'var(--text-dark)', 
                  margin: '0', 
                  position: 'relative', 
                  zIndex: '2', 
                  fontSize: isMobile ? '18px' : isTablet ? '20px' : '22px', 
                  fontWeight: 'bold' 
                }}>生成我的专属自媒体策划方案</Title>
                <Paragraph style={{ 
                  color: 'var(--text-medium)', 
                  margin: '10px 0 0 0', 
                  position: 'relative', 
                  zIndex: '2', 
                  fontSize: isMobile ? '13px' : '15px',
                  lineHeight: '1.5'
                }}>
                  基于您的个人特点和目标，量身定制专业的自媒体发展策略
                </Paragraph>
              </div>
            </div>

            {/* 第二个特色模块 */}
            <div 
              className={`${styles.module} ${styles['module--purple']}`}
              onClick={handleCreativeToolsPage}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.07)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.03)';
              }}
            >
              <div className={`${styles['module__icon']} ${styles['module__icon--purple']}`}>
                🔍
              </div>
              <div>
                <Title level={3} style={{ 
                  color: 'var(--text-dark)', 
                  margin: '0', 
                  position: 'relative', 
                  zIndex: '2', 
                  fontSize: isMobile ? '18px' : isTablet ? '20px' : '22px', 
                  fontWeight: 'bold' 
                }}>爆款内容工具</Title>
                <Paragraph style={{ 
                  color: 'var(--text-medium)', 
                  margin: '10px 0 0 0', 
                  position: 'relative', 
                  zIndex: '2', 
                  fontSize: isMobile ? '13px' : '15px',
                  lineHeight: '1.5'
                }}>
                  发现多种AI创作工具，让您的内容创作更丰富多样
                </Paragraph>
              </div>
            </div>
          </div>

          {/* 功能按钮与个人档案容器 */}
          <div className={styles['features-profile']}>
            {/* 功能按钮区域 */}
            <div className={styles.features}>
              {/* 专属昵称简介按钮 */}
              <div 
                className={styles.feature}
                onClick={handleMediaIntroductionGeneration}
                onMouseOver={(e) => handleFeatureButtonMouseOver(e, 'green')}
                onMouseOut={(e) => handleFeatureButtonMouseOut(e, 'green')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`${styles['feature__decorator']} ${styles['feature__decorator--green']}`}></div>
                <i className={`${styles['feature__icon']} ${styles['feature__icon--green']}`}>👤</i>
                <span className={styles['feature__text']}>专属昵称简介</span>
              </div>

              {/* 内容文案创作按钮 */}
              <div 
                className={styles.feature}
                onClick={handleMediaContentGeneration}
                onMouseOver={(e) => handleFeatureButtonMouseOver(e, 'purple')}
                onMouseOut={(e) => handleFeatureButtonMouseOut(e, 'purple')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`${styles['feature__decorator']} ${styles['feature__decorator--purple']}`}></div>
                <i className={`${styles['feature__icon']} ${styles['feature__icon--purple']}`}>📝</i>
                <span className={styles['feature__text']}>内容文案创作</span>
              </div>

              {/* 精准内容选题按钮 */}
              <div 
                className={styles.feature}
                onClick={handleContentTopicGeneration}
                onMouseOver={(e) => handleFeatureButtonMouseOver(e, 'orange')}
                onMouseOut={(e) => handleFeatureButtonMouseOut(e, 'orange')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`${styles['feature__decorator']} ${styles['feature__decorator--orange']}`}></div>
                <i className={`${styles['feature__icon']} ${styles['feature__icon--orange']}`}>📊</i>
                <span className={styles['feature__text']}>精准内容选题</span>
              </div>

              {/* 账号分析工具按钮 */}
              <div 
                className={styles.feature}
                onClick={handleAnalyticsPage}
                onMouseOver={(e) => handleFeatureButtonMouseOver(e, 'blue')}
                onMouseOut={(e) => handleFeatureButtonMouseOut(e, 'blue')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`${styles['feature__decorator']} ${styles['feature__decorator--blue']}`}></div>
                <i className={`${styles['feature__icon']} ${styles['feature__icon--blue']}`}>📊</i>
                <span className={styles['feature__text']}>账号分析工具</span>
              </div>
            </div>

            {/* 个人档案部分 */}
            <div className={styles.profile}>
              <div className="section-header" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '10px' : '15px',
                height: '100%'
              }}>
                <div className="section-title" style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  marginBottom: isMobile ? '15px' : '20px',
                  paddingLeft: '0',
                  position: 'relative',
                  paddingBottom: isMobile ? '8px' : '10px',
                  borderBottom: '1px solid #eee'
                }}>个人档案</div>
                <div className="profile-buttons" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '8px' : '10px',
                  flexGrow: '1'
                }}>
                  <div className="profile-button" style={{
                    padding: isMobile ? '12px' : '14px 15px',
                    background: 'linear-gradient(135deg, #f4f7f4, #f0f5f0)',
                    color: '#43a047',
                    borderRadius: isMobile ? '6px' : '8px',
                    transition: 'all 0.3s',
                    fontWeight: '500',
                    textAlign: 'center',
                    border: '1px solid rgba(102, 187, 106, 0.15)',
                    fontSize: isMobile ? '14px' : 'inherit'
                  }}>
                    添加个人档案
                  </div>
                  <div className="profile-button" style={{
                    padding: isMobile ? '12px' : '14px 15px',
                    background: 'linear-gradient(135deg, #f4f7f4, #f0f5f0)',
                    color: '#43a047',
                    borderRadius: isMobile ? '6px' : '8px',
                    transition: 'all 0.3s',
                    fontWeight: '500',
                    textAlign: 'center',
                    border: '1px solid rgba(102, 187, 106, 0.15)',
                    fontSize: isMobile ? '14px' : 'inherit'
                  }}>
                    我的个人档案
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 保留原有功能卡片 */}
      <div className={styles['page__main-content']}>
        <div className={styles['page__content-wrapper']}>
          {/* 我的策划方案模块 - 仅在有策划方案或正在加载时显示 */}
          {(profilesLoading || userProfiles.length > 0) && (
            <div className={styles['plan-section']}>
              <div className={styles['plan-section__title']}>我的策划方案</div>
              
              {profilesLoading ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <Spin />
                </div>
              ) : (
                <div className={styles['plan-cards']}>
                  {userProfiles.map((profile, index) => (
                    <div 
                      key={profile.id}
                      className={`${styles['plan-card']} ${styles[`plan-card--${getCardColorType(index)}`]}`} 
                      onClick={() => handlePlanCardClick(profile.id)}
                    >
                      <div className={styles['plan-card__name']}>{profile.name}</div>
                      <div className={styles['plan-card__positions']}>
                        {profile.positions.map((position, posIndex) => (
                          <div key={`${profile.id}-pos-${posIndex}`} className={styles['plan-card__position']}>
                            {position}
                          </div>
                        ))}
                      </div>
                      <div className={styles['plan-card__meta']}>
                        <div className={styles['plan-card__meta-item']}>
                          <span className={styles['plan-card__meta-icon']}>🕒</span>
                          <span>{formatUpdateTime(profile.updateTime)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 策划广场模块 */}
          <div className={styles['plaza-section']}>
            <div className={styles['plaza-section__title']}>策划广场</div>
            <div className={styles['plaza-cards']}>
              {plazaProfiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className={styles['plaza-card']}
                  onClick={() => handlePlazaCardClick(profile)}
                >
                  <div className={styles['plaza-card__image']}>
                    <img src={profile.image} alt={profile.name} />
                  </div>
                  <div className={styles['plaza-card__title']}>{profile.name}</div>
                </div>
              ))}
            </div>
          </div>
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

      {/* 策划方案详情弹窗 */}
      <Modal
        title="策划方案详情"
        open={profileDetailVisible}
        onCancel={handleProfileDetailClose}
        footer={[
          <Button key="close" onClick={handleProfileDetailClose}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedProfile && (
          <div className={styles['profile-detail']}>
            <div className={styles['profile-detail__header']}>
              <img 
                src={selectedProfile.image} 
                alt={selectedProfile.name}
                className={styles['profile-detail__avatar']}
              />
              <div className={styles['profile-detail__info']}>
                <h2>{selectedProfile.name}</h2>
                <p className={styles['profile-detail__description']}>{selectedProfile.description}</p>
                <p className={styles['profile-detail__position']}>{selectedProfile.position}</p>
              </div>
            </div>

            <div className={styles['profile-detail__section']}>
              <h3>内容方向</h3>
              <ul>
                {selectedProfile.contentDirection.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles['profile-detail__section']}>
              <h3>推荐选题</h3>
              <ul>
                {selectedProfile.recommendedTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>

            <div className={styles['profile-detail__section']}>
              <h3>运营建议</h3>
              <ul>
                {selectedProfile.operationSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;