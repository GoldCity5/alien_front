/* 策划方案生成页面侧边栏组件 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { getMediaProfiles } from '../../services/mediaProfileService';
import { Spin, Empty, Result } from 'antd';
import './mediaProfileSidebar.css';

interface MediaProfile {
  id: string;
  nickname: string;
  age: number;
  gender: string;
  occupation: string;
  mediaPlat: string | string[];
  createdAt: string;
}

interface MediaProfileSidebarProps {
  // 可以添加任何需要的props
}

// 创建一个自定义事件用于通知档案被删除和创建
export const profileEvents = {
  onProfileDeleted: new EventTarget(),
  onProfileCreate: new EventTarget()
};

const MediaProfileSidebar: React.FC<MediaProfileSidebarProps> = () => {
  const [profiles, setProfiles] = useState<MediaProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取URL中的profileId参数
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const profileId = params.get('profileId');
    if (profileId) {
      setSelectedProfileId(profileId);
    }
  }, [location]);

  // 获取档案列表的函数
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await getMediaProfiles();
      const profilesData = response.data.data || [];
      setProfiles(profilesData);
    } catch (error) {
      console.error('获取档案列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载档案列表
  useEffect(() => {
    fetchProfiles();
  }, []);

  // 监听档案删除事件
  useEffect(() => {
    const handleProfileDeleted = () => {
      // 重新获取档案列表
      fetchProfiles();
      // 如果当前选中的档案已被删除，清除选中状态
      if (selectedProfileId && !profiles.some(p => p.id === selectedProfileId)) {
        setSelectedProfileId(null);
      }
    };

    // 添加事件监听
    profileEvents.onProfileDeleted.addEventListener('profileDeleted', handleProfileDeleted);

    // 清除事件监听
    return () => {
      profileEvents.onProfileDeleted.removeEventListener('profileDeleted', handleProfileDeleted);
    };
  }, [selectedProfileId, profiles]);

  // 选择档案
  const handleSelectProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    navigate(`/media-profile?profileId=${profileId}&autoSelect=true`);
  };

  // 新建档案
  const handleCreateProfile = () => {
    // 触发创建档案事件
    profileEvents.onProfileCreate.dispatchEvent(new Event('profileCreate'));
    // 导航到档案页面
    navigate('/media-profile');
  };

  return (
    <div className="profile-sidebar">
      {/* 档案列表区域 */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-name">自媒体档案</div>
          <div className="profile-tag">个人媒体账号管理</div>
        </div>
      </div>
      
      <div className="archive-section">
        <div className="archive-title">
          <span>全部档案</span>
          <div className="add-icon" onClick={handleCreateProfile}>
            <PlusOutlined />
          </div>
        </div>
        
        <Spin spinning={loading}>
          <div className="user-cards">
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <div 
                  key={profile.id} 
                  className={`user-card ${profile.id === selectedProfileId ? 'active' : ''}`}
                  onClick={() => handleSelectProfile(profile.id)}
                >
                  <div className="user-card-header">
                    <div className="user-name">{profile.nickname}</div>
                    <div className="user-tag">
                      {profile.occupation} · {profile.age}岁
                      {typeof profile.mediaPlat === 'string' && 
                        ` · ${profile.mediaPlat.split(',')[0]}`}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="暂无档案，点击上方+号创建" 
                className="empty-card"
              />
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default MediaProfileSidebar; 