import * as React from 'react';
import { Typography, Button, List, Card, Empty, Spin, message, Popconfirm, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getMediaProfiles, getMediaProfileDetail, deleteMediaProfile } from '../../services/mediaProfileService';
import BasicInfoModal from './BasicInfoModal';
import ExperienceInfoModal from './ExperienceInfoModal';
import GoalsInfoModal from './GoalsInfoModal';
import MediaPlanResult from './MediaPlanResult';
import { useLocation } from 'react-router-dom';

const { useState, useEffect } = React;

const { Title } = Typography;

// 辅助函数：解析URL查询参数
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface MediaProfile {
  id: string;
  nickname: string;
  age: number;
  occupation: string;
  personalityTraits: string;
  educationBackground: string;
  mediaPlat: string;
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
  mediaPlan?: string;
  createdAt: string;
}

const MediaProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<MediaProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MediaProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [basicModalVisible, setBasicModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MediaProfile | null>(null);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);
  
  // 获取URL查询参数
  const query = useQuery();
  const profileIdFromUrl = query.get('profileId');
  const showPlan = query.get('showPlan') === 'true';
  const autoSelect = query.get('autoSelect') === 'true';

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
      } else if (profilesData.length === 0) {
        // 如果没有档案，自动打开新增档案弹窗
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
    } catch (error) {
      console.error('删除档案失败:', error);
      message.error('删除档案失败');
    } finally {
      setLoading(false);
    }
  };

  // 选择档案
  const handleSelectProfile = (profile: MediaProfile) => {
    fetchProfileDetail(profile.id);
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
    fetchProfiles();
    if (currentProfileId) {
      fetchProfileDetail(currentProfileId);
    }
  };

  // 查看档案详情
  const handleViewProfileDetail = () => {
    if (selectedProfile) {
      setProfileDetailVisible(true);
    }
  };

  // 关闭档案详情弹窗
  const handleCloseProfileDetail = () => {
    setProfileDetailVisible(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px - 69px)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Title level={2}>我的自媒体策划方案</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreateProfile}
        >
          新增档案
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 左侧档案列表 */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <Card 
            title="我的档案" 
            style={{ marginBottom: '20px' }}
            bodyStyle={{ padding: '10px', maxHeight: '600px', overflow: 'auto' }}
          >
            <Spin spinning={loading}>
              {profiles.length > 0 ? (
                <List
                  dataSource={profiles}
                  renderItem={(item) => (
                    <List.Item 
                      key={item.id}
                      onClick={() => handleSelectProfile(item)}
                      style={{ 
                        cursor: 'pointer',
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: selectedProfile?.id === item.id ? '#e6f7ff' : 'transparent'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{item.nickname}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {item.occupation} · {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<InfoCircleOutlined />} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProfile(item);
                            setProfileDetailVisible(true);
                          }}
                        />
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined />} 
                          onClick={(e) => handleEditProfile(item, e)}
                        />
                        <Popconfirm
                          title="确定删除该档案吗？"
                          description="删除后无法恢复，相关的策划方案也将一并删除。"
                          onConfirm={(e) => handleDeleteProfile(item.id, e as React.MouseEvent)}
                          okText="确定"
                          cancelText="取消"
                          placement="left"
                        >
                          <Button 
                            type="text" 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无档案" />
              )}
            </Spin>
          </Card>
        </div>

        {/* 中间策划方案内容 */}
        <div style={{ flex: 1 }}>
          {selectedProfile ? (
            <MediaPlanResult profile={selectedProfile} onViewDetail={handleViewProfileDetail} />
          ) : (
            <Card>
              <Empty 
                description="请选择或创建一个档案" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>

        {/* 右侧预留区域 */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {/* 预留区域，后续可添加功能按钮 */}
        </div>
      </div>

      {/* 弹窗组件 */}
      <BasicInfoModal 
        visible={basicModalVisible}
        onCancel={() => setBasicModalVisible(false)}
        onSuccess={handleBasicInfoSuccess}
        initialValues={isEditing ? editingProfile : undefined}
        profileId={isEditing ? currentProfileId : undefined}
        isEditing={isEditing}
      />

      {currentProfileId && (
        <>
          <ExperienceInfoModal 
            visible={experienceModalVisible}
            profileId={currentProfileId}
            onCancel={() => setExperienceModalVisible(false)}
            onSuccess={handleExperienceInfoSuccess}
          />

          <GoalsInfoModal 
            visible={goalsModalVisible}
            profileId={currentProfileId}
            onCancel={() => setGoalsModalVisible(false)}
            onSuccess={handleGoalsInfoSuccess}
          />
        </>
      )}

      {/* 档案详情弹窗 */}
      {selectedProfile && (
        <Modal
          title="档案详情"
          open={profileDetailVisible}
          onCancel={handleCloseProfileDetail}
          footer={[
            <Button key="close" onClick={handleCloseProfileDetail}>
              关闭
            </Button>
          ]}
          width={700}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Title level={4}>{selectedProfile.nickname}</Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                <Tag color="blue">{selectedProfile.age}岁</Tag>
                <Tag color="purple">{selectedProfile.occupation}</Tag>
                {Array.isArray(selectedProfile.mediaPlat) 
                  ? selectedProfile.mediaPlat.map((plat: string) => (
                      <Tag key={plat} color="green">{plat}</Tag>
                    ))
                  : typeof selectedProfile.mediaPlat === 'string' && selectedProfile.mediaPlat.split(',').map((plat: string) => (
                      <Tag key={plat} color="green">{plat.trim()}</Tag>
                    ))
                }
              </div>
            </div>

            <div>
              <Title level={5}>基本信息</Title>
              <div style={{ marginTop: '8px' }}>
                <div><strong>性格特点：</strong>{selectedProfile.personalityTraits}</div>
                <div style={{ marginTop: '8px' }}><strong>教育背景：</strong>{selectedProfile.educationBackground}</div>
              </div>
            </div>

            {(selectedProfile.careerExperience || selectedProfile.specialExperience || selectedProfile.uniqueExperience) && (
              <div>
                <Title level={5}>经历信息</Title>
                <div style={{ marginTop: '8px' }}>
                  {selectedProfile.careerExperience && (
                    <div><strong>职业经历：</strong>{selectedProfile.careerExperience}</div>
                  )}
                  {selectedProfile.specialExperience && (
                    <div style={{ marginTop: '8px' }}><strong>特殊经历：</strong>{selectedProfile.specialExperience}</div>
                  )}
                  {selectedProfile.uniqueExperience && (
                    <div style={{ marginTop: '8px' }}><strong>特别经历：</strong>{selectedProfile.uniqueExperience}</div>
                  )}
                  {selectedProfile.interests && (
                    <div style={{ marginTop: '8px' }}><strong>兴趣爱好：</strong>{selectedProfile.interests}</div>
                  )}
                </div>
              </div>
            )}

            {(selectedProfile.targetTrack || selectedProfile.targetAudience) && (
              <div>
                <Title level={5}>目标信息</Title>
                <div style={{ marginTop: '8px' }}>
                  {selectedProfile.targetTrack && (
                    <div><strong>想做的赛道：</strong>{selectedProfile.targetTrack}</div>
                  )}
                  {selectedProfile.targetAudience && (
                    <div style={{ marginTop: '8px' }}><strong>目标受众：</strong>{selectedProfile.targetAudience}</div>
                  )}
                  {selectedProfile.contentCreationAbility && (
                    <div style={{ marginTop: '8px' }}><strong>内容创作能力：</strong>{selectedProfile.contentCreationAbility}</div>
                  )}
                  {selectedProfile.accountPurpose && (
                    <div style={{ marginTop: '8px' }}><strong>做账号的原因：</strong>{selectedProfile.accountPurpose}</div>
                  )}
                  {selectedProfile.shortTermGoals && (
                    <div style={{ marginTop: '8px' }}><strong>短期目标：</strong>{selectedProfile.shortTermGoals}</div>
                  )}
                  {selectedProfile.benchmarkAccounts && (
                    <div style={{ marginTop: '8px' }}><strong>对标账号：</strong>{selectedProfile.benchmarkAccounts}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MediaProfilePage;
