import * as React from 'react';
import { Typography, Button, Card, Empty, message, Popconfirm, Collapse } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, FileTextOutlined, AimOutlined } from '@ant-design/icons';
import { getMediaProfiles, getMediaProfileDetail, deleteMediaProfile } from '../../services/mediaProfileService';
import BasicInfoModal from './BasicInfoModal';
import ExperienceInfoModal from './ExperienceInfoModal';
import GoalsInfoModal from './GoalsInfoModal';
import MediaPlanResult from './MediaPlanResult';
import { useLocation, useNavigate } from 'react-router-dom';
import { profileEvents } from './MediaProfileSidebar'; // 导入自定义事件
import './mediaProfileSidebar.css';
import './mediaProfilePage.css';

const { useState, useEffect } = React;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// 辅助函数：解析URL查询参数
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface MediaProfile {
  id: string;
  nickname: string;
  age: number;
  gender: string;
  occupation: string;
  personalityTraits: string;
  educationBackground: string;
  mediaPlat: string | string[];
  careerExperience?: string;
  specialExperience?: string;
  uniqueExperience?: string;
  interests?: string;
  targetTrack?: string;
  targetAudience?: string;
  contentCreationAbility?: string;
  accountPurpose?: string;
  shortTermGoals?: string;
  benchmarkAccounts?: string;
  availableTime?: string; // 可以投入的时间
  otherInfo?: string; // 其他补充信息
  mediaPlan?: string;
  createdAt: string;
}

const MediaProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<MediaProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MediaProfile | null>(null);
  const [, setLoading] = useState(false);
  const [basicModalVisible, setBasicModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MediaProfile | null>(null);
  // 控制折叠面板的展开状态
  const [activeKeys, setActiveKeys] = useState<string[]>(['1']);
  
  const navigate = useNavigate();
  
  // 获取URL查询参数
  const query = useQuery();
  const profileIdFromUrl = query.get('profileId');
  const autoSelect = query.get('autoSelect') === 'true';
  // 检查是否需要自动打开基本信息弹窗
  const openBasicInfo = query.get('openBasicInfo') === 'true';

  // 获取档案列表
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await getMediaProfiles();
      const profilesData = response.data.data || [];
      setProfiles(profilesData);
      
      // 如果URL中有profileId，则自动选择该档案
      if (profileIdFromUrl && autoSelect && profilesData.length > 0) {
        // 查找匹配的档案
        const targetProfile = profilesData.find((p: MediaProfile) => p.id === profileIdFromUrl);
        if (targetProfile) {
          // 获取详情并选中该档案
          fetchProfileDetail(targetProfile.id);
        }
      } else if ((profilesData.length === 0 || openBasicInfo) && !goalsModalVisible) {
        // 只有在没有档案或URL参数要求打开基本信息弹窗，且不是从目标信息弹窗关闭过来时，才自动打开新增档案弹窗
        setBasicModalVisible(true);
      }
    } catch (error) {
      console.error('获取档案列表失败:', error);
      message.error('获取档案列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取档案详情
  const fetchProfileDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await getMediaProfileDetail(id);
      setSelectedProfile(response.data.data);
      
      // 重置折叠面板状态，只展开基本信息
      setActiveKeys(['1']);
      
      // 移除自动显示详情弹窗的逻辑
      // 只自动选择档案，不弹出详情
    } catch (error) {
      console.error('获取档案详情失败:', error);
      message.error('获取档案详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // 监听URL参数变化，处理从卡片点击进入的情况
  useEffect(() => {
    if (profileIdFromUrl && autoSelect && profiles.length > 0) {
      const targetProfile = profiles.find((p: MediaProfile) => p.id === profileIdFromUrl);
      if (targetProfile) {
        fetchProfileDetail(targetProfile.id);
      }
    }
  }, [profileIdFromUrl, autoSelect, profiles]);

  // 监听创建档案事件
  useEffect(() => {
    const handleProfileCreate = () => {
      setIsEditing(false);
      setEditingProfile(null);
      setBasicModalVisible(true);
    };
    
    // 添加事件监听
    profileEvents.onProfileCreate.addEventListener('profileCreate', handleProfileCreate);
    
    // 组件卸载时清除事件监听
    return () => {
      profileEvents.onProfileCreate.removeEventListener('profileCreate', handleProfileCreate);
    };
  }, []);

  // 创建新档案
  const handleCreateProfile = () => {
    setIsEditing(false);
    setEditingProfile(null);
    setBasicModalVisible(true);
  };

  // 编辑档案
  const handleEditProfile = (profile: MediaProfile, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发选择档案
    setIsEditing(true);
    setEditingProfile(profile);
    setCurrentProfileId(profile.id);
    setBasicModalVisible(true);
  };

  // 删除档案
  const handleDeleteProfile = async (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发选择档案
    setLoading(true);
    try {
      await deleteMediaProfile(profileId);
      message.success('档案删除成功');
      
      // 刷新档案列表
      fetchProfiles();
      
      // 如果删除的是当前选中的档案，清空选中状态
      if (selectedProfile && selectedProfile.id === profileId) {
        setSelectedProfile(null);
      }
      
      // 触发档案删除事件，通知侧边栏更新
      profileEvents.onProfileDeleted.dispatchEvent(new Event('profileDeleted'));
    } catch (error) {
      console.error('删除档案失败:', error);
      message.error('删除档案失败');
    } finally {
      setLoading(false);
    }
  };


  // 基本信息提交成功
  const handleBasicInfoSuccess = (profileId: string) => {
    setBasicModalVisible(false);
    setCurrentProfileId(profileId);
    
    if (!isEditing) {
      // 如果是新建档案，继续展示经历信息弹窗
      setExperienceModalVisible(true);
    } else {
      // 如果是编辑档案，刷新档案列表和详情
      fetchProfiles();
      if (profileId) {
        fetchProfileDetail(profileId);
      }
      setIsEditing(false);
      setEditingProfile(null);
      
      // 触发事件通知侧边栏更新
      profileEvents.onProfileDeleted.dispatchEvent(new Event('profileDeleted'));
    }
  };

  // 经历信息提交成功
  const handleExperienceInfoSuccess = () => {
    setExperienceModalVisible(false);
    setGoalsModalVisible(true);
  };

  // 目标信息提交成功
  const handleGoalsInfoSuccess = () => {
    setGoalsModalVisible(false);
    
    // 创建新的URL，移除openBasicInfo参数
    const url = new URL(window.location.href);
    url.searchParams.delete('openBasicInfo');
    window.history.replaceState({}, '', url.toString());
    
    fetchProfiles();
    if (currentProfileId) {
      fetchProfileDetail(currentProfileId);
    }
    
    // 触发事件通知侧边栏更新
    profileEvents.onProfileDeleted.dispatchEvent(new Event('profileDeleted'));
  };

  // 处理返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  // 处理生成选题
  const handleGenerateTopic = () => {
    // 如果有选中的档案，带上档案ID参数
    if (selectedProfile) {
      navigate(`/content-topic?profileId=${selectedProfile.id}`);
    } else {
      // 没有选中档案，直接跳转
      navigate('/content-topic');
    }
  };

  // 处理生成昵称简介
  const handleGenerateIntroduction = () => {
    // 如果有选中的档案，带上档案ID参数
    if (selectedProfile) {
      navigate(`/media-introduction?profileId=${selectedProfile.id}`);
    } else {
      // 没有选中档案，直接跳转
      navigate('/media-introduction');
    }
  };

  // 处理生成文案
  const handleGenerateContent = () => {
    // 如果有选中的档案，带上档案ID参数
    if (selectedProfile) {
      navigate(`/media-content?profileId=${selectedProfile.id}`);
    } else {
      // 没有选中档案，直接跳转
      navigate('/media-content');
    }
  };

  return (
    <div className="page-wrapper">
      {/* 操作按钮组 */}
      <div className="right-actions">
        <button className="right-action-btn" type="button" onClick={handleGenerateTopic}>
          <div className="icon-container">
            <div className="icon-glow"></div>
          </div>
          <div className="btn-text">生成选题</div>
        </button>
        <button className="right-action-btn" type="button" onClick={handleGenerateIntroduction}>
          <div className="icon-container">
            <div className="icon-glow"></div>
          </div>
          <div className="btn-text">生成昵称简介</div>
        </button>
        <button className="right-action-btn" type="button" onClick={handleGenerateContent}>
          <div className="icon-container">
            <div className="icon-glow"></div>
          </div>
          <div className="btn-text">生成文案</div>
        </button>
      </div>
      
      {/* 返回按钮 - 移动位置使其不与操作按钮组冲突 */}
      <div className="back-btn" onClick={handleBackToHome}>
        <span>返回</span>
      </div>
      
      <div className="media-profile-container">
        <div className="profile-content-wrapper">
          <div className="profile-header">
            <Title level={2} className="profile-title">
              我的自媒体策划方案
            </Title>
            {!selectedProfile ? (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateProfile}
                className="create-profile-btn"
          >
            新增档案
          </Button>
            ) : (
              <div className="profile-actions">
                <Button 
                  type="default" 
                  icon={<EditOutlined />} 
                  onClick={() => handleEditProfile(selectedProfile, {} as React.MouseEvent)}
                  className="edit-profile-btn"
                >
                  编辑档案
                </Button>
                
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleCreateProfile}
                  className="create-profile-btn-inline"
                >
                  新建档案
                </Button>
                
                <Popconfirm
                  title="确定要删除此档案吗？"
                  description="删除后无法恢复，相关的策划方案也将一并删除。"
                  onConfirm={(e) => handleDeleteProfile(selectedProfile.id, e as React.MouseEvent)}
                  okText="确定"
                  cancelText="取消"
                  placement="left"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    className="delete-profile-btn"
                  >
                    删除档案
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>

          {selectedProfile ? (
            <div className="two-column-layout">
              {/* 左侧档案信息展示 */}
              <div className="left-column">
                <Card className="profile-info-card">
                  <Collapse 
                    activeKey={activeKeys}
                    onChange={(keys) => setActiveKeys(keys as string[])}
                    bordered={false}
                    expandIconPosition="end"
                    className="profile-collapse"
                  >
                    <Panel 
                      header={
                        <div className="panel-header">
                          <UserOutlined className="panel-icon" />
                          <span className="panel-title">基本信息</span>
                        </div>
                      } 
                      key="1"
                      className="profile-panel"
                    >
                      <div className="info-grid">
                        {/* 第一行：昵称 */}
                        {selectedProfile.nickname && (
                          <div className="info-item highlight full-width">
                            <Text type="secondary" className="info-label">昵称</Text>
                            <Text strong className="info-value">{selectedProfile.nickname}</Text>
                          </div>
                        )}
                        
                        {/* 第二行：职业和平台 */}
                        <div className="info-row">
                          {selectedProfile.occupation && (
                            <div className="info-item highlight">
                              <Text type="secondary" className="info-label">职业</Text>
                              <Text strong className="info-value">{selectedProfile.occupation}</Text>
                            </div>
                          )}
                          {selectedProfile.mediaPlat && (
                            <div className="info-item highlight">
                              <Text type="secondary" className="info-label">平台</Text>
                              <Text strong className="info-value">{selectedProfile.mediaPlat}</Text>
                            </div>
                          )}
            </div>

                        {/* 第三行：年龄和性别 */}
                        <div className="info-row">
                          {selectedProfile.age > 0 && (
                            <div className="info-item">
                              <Text type="secondary" className="info-label">年龄</Text>
                              <Text strong className="info-value">{selectedProfile.age}岁</Text>
                            </div>
                          )}
                          {selectedProfile.gender && (
                            <div className="info-item">
                              <Text type="secondary" className="info-label">性别</Text>
                              <Text strong className="info-value">{selectedProfile.gender}</Text>
                            </div>
              )}
            </div>

                        {/* 其他信息 */}
                        {selectedProfile.personalityTraits && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">性格特点</Text>
                            <Text strong className="info-value">{selectedProfile.personalityTraits}</Text>
                          </div>
                        )}
                        {selectedProfile.educationBackground && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">教育背景</Text>
                            <Text strong className="info-value">{selectedProfile.educationBackground}</Text>
                          </div>
                        )}
                      </div>
                    </Panel>

                    <Panel 
                      header={
                        <div className="panel-header">
                          <FileTextOutlined className="panel-icon" />
                          <span className="panel-title">经历信息</span>
                        </div>
                      } 
                      key="2"
                      className="profile-panel"
                    >
                      <div className="info-grid">
                        {selectedProfile.careerExperience && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">工作经历</Text>
                            <Text strong className="info-value">{selectedProfile.careerExperience}</Text>
                          </div>
                        )}
                        {selectedProfile.specialExperience && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">特殊经历</Text>
                            <Text strong className="info-value">{selectedProfile.specialExperience}</Text>
                          </div>
                        )}
                        {selectedProfile.uniqueExperience && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">独特经历</Text>
                            <Text strong className="info-value">{selectedProfile.uniqueExperience}</Text>
                          </div>
                        )}
                        {selectedProfile.interests && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">兴趣爱好</Text>
                            <Text strong className="info-value">{selectedProfile.interests}</Text>
                          </div>
                        )}
                      </div>
                    </Panel>

                    <Panel 
                      header={
                        <div className="panel-header">
                          <AimOutlined className="panel-icon" />
                          <span className="panel-title">目标信息</span>
                        </div>
                      } 
                      key="3"
                      className="profile-panel"
                    >
                      <div className="info-grid">
                        {selectedProfile.targetTrack && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">定位方向</Text>
                            <Text strong className="info-value">{selectedProfile.targetTrack}</Text>
                          </div>
                        )}
                        {selectedProfile.targetAudience && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">目标受众</Text>
                            <Text strong className="info-value">{selectedProfile.targetAudience}</Text>
                          </div>
                        )}
                        {selectedProfile.contentCreationAbility && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">内容创作能力</Text>
                            <Text strong className="info-value">{selectedProfile.contentCreationAbility}</Text>
                          </div>
                        )}
                        {selectedProfile.accountPurpose && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">账号目的</Text>
                            <Text strong className="info-value">{selectedProfile.accountPurpose}</Text>
                          </div>
                        )}
                        {selectedProfile.shortTermGoals && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">短期目标</Text>
                            <Text strong className="info-value">{selectedProfile.shortTermGoals}</Text>
                          </div>
                        )}
                        {selectedProfile.benchmarkAccounts && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">参考账号</Text>
                            <Text strong className="info-value">{selectedProfile.benchmarkAccounts}</Text>
                          </div>
                        )}
                        {selectedProfile.availableTime && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">可投入时间</Text>
                            <Text strong className="info-value">{selectedProfile.availableTime}</Text>
                          </div>
                        )}
                        {selectedProfile.otherInfo && (
                          <div className="info-item full-width">
                            <Text type="secondary" className="info-label">其他信息</Text>
                            <Text strong className="info-value">{selectedProfile.otherInfo}</Text>
                          </div>
                        )}
                      </div>
                    </Panel>
                  </Collapse>
                </Card>
              </div>

              {/* 右侧策划方案展示 */}
              <div className="right-column">
                <div className="plan-content-wrapper">
                  <MediaPlanResult profile={selectedProfile} />
                </div>
              </div>
            </div>
          ) : (
            <div className="no-profile-selected">
              <Empty 
                description={
                  <span>
                    {profiles.length > 0 ? 
                      '请从左侧选择一个档案，或创建新档案' : 
                      '暂无档案，请点击上方"新增档案"按钮创建'
                    }
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_DEFAULT}
              />
          </div>
          )}
        </div>

        {/* 以下是原有的modal组件，保持不变 */}
        <BasicInfoModal 
          visible={basicModalVisible}
          onCancel={() => setBasicModalVisible(false)}
          onSuccess={handleBasicInfoSuccess}
          initialValues={isEditing ? editingProfile : undefined}
          isEditing={isEditing}
        />

            <ExperienceInfoModal 
              visible={experienceModalVisible}
              onCancel={() => setExperienceModalVisible(false)}
              onSuccess={handleExperienceInfoSuccess}
          profileId={currentProfileId || ''}
            />

            <GoalsInfoModal 
              visible={goalsModalVisible}
              onCancel={() => setGoalsModalVisible(false)}
              onSuccess={handleGoalsInfoSuccess}
          profileId={currentProfileId || ''}
        />
      </div>
    </div>
  );
};

export default MediaProfilePage;
