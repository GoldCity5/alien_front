import * as React from 'react';
import { Typography, Button, List, Card, Empty, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getMediaProfiles, getMediaProfileDetail } from '../../services/mediaProfileService';
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

  // 获取档案列表
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await getMediaProfiles();
      setProfiles(response.data.data || []);
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
    setBasicModalVisible(true);
  };

  // 选择档案
  const handleSelectProfile = (profile: MediaProfile) => {
    fetchProfileDetail(profile.id);
  };

  // 基本信息提交成功
  const handleBasicInfoSuccess = (profileId: string) => {
    setBasicModalVisible(false);
    setCurrentProfileId(profileId);
    setExperienceModalVisible(true);
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
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.nickname}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {item.occupation} · {new Date(item.createdAt).toLocaleDateString()}
                        </div>
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
