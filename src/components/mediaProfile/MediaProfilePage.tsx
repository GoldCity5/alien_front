import * as React from 'react';
import { Typography, Button, List, Card, Empty, Spin, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMediaProfiles, getMediaProfileDetail, deleteMediaProfile } from '../../services/mediaProfileService';
import BasicInfoModal from './BasicInfoModal';
import ExperienceInfoModal from './ExperienceInfoModal';
import GoalsInfoModal from './GoalsInfoModal';
import MediaPlanResult from './MediaPlanResult';

const { useState, useEffect } = React;

const { Title } = Typography;

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

  // 获取档案列表
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await getMediaProfiles();
      const profilesData = response.data.data || [];
      setProfiles(profilesData);
      
      // 如果没有档案，自动打开新增档案弹窗
      if (profilesData.length === 0) {
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
        <div style={{ width: '300px', flexShrink: 0 }}>
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

        {/* 右侧档案详情和生成结果 */}
        <div style={{ flex: 1 }}>
          {selectedProfile ? (
            <MediaPlanResult profile={selectedProfile} />
          ) : (
            <Card>
              <Empty 
                description="请选择或创建一个档案" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
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
    </div>
  );
};

export default MediaProfilePage;
