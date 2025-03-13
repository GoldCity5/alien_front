import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message, Typography, Divider, Tag, Space } from 'antd';
import { generateMediaPlanWithSSE, saveMediaPlan } from '../../services/mediaProfileService';

const { Title, Paragraph, Text } = Typography;

interface MediaProfile {
  id: string;
  nickname: string;
  age: number;
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
  mediaPlan?: string;
  createdAt: string;
}

interface MediaPlanResultProps {
  profile: MediaProfile;
}

const MediaPlanResult: React.FC<MediaPlanResultProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [planContent, setPlanContent] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // 使用 useEffect 确保内容更新时页面重新渲染
  useEffect(() => {
    // 这个空的 useEffect 会在 planContent 更新时触发组件重新渲染
  }, [planContent]);

  // 初始化时，如果档案已有策划方案，则直接显示
  useEffect(() => {
    if (profile.mediaPlan) {
      setPlanContent(profile.mediaPlan);
    } else {
      setPlanContent('');
    }
  }, [profile]);

  // 判断是否已有策划方案
  const hasExistingPlan = !!profile.mediaPlan && profile.mediaPlan.trim() !== '';

  // 保存媒体策划方案
  const savePlan = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setSaving(true);
      await saveMediaPlan(profile.id, content);
      message.success('策划方案保存成功');
    } catch (error) {
      console.error('保存策划方案失败:', error);
      message.error('保存策划方案失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  // 生成媒体策划方案
  const handleGeneratePlan = () => {
    setGenerating(true);
    setLoading(true);
    setPlanContent('');
    
    let finalContent = ''; // 用于存储最终的完整内容
    
    // 使用SSE工具处理流式响应
    generateMediaPlanWithSSE({
      id: profile.id,
      onStart: () => {
        console.log('开始生成媒体策划方案');
      },
      onMessage: (content) => {
        // 确保内容实时更新到UI
        setPlanContent(prev => {
          const newContent = prev + content;
          finalContent = newContent; // 同时更新闭包外的变量
          console.log('收到新内容，当前长度:', newContent.length);
          return newContent;
        });
      },
      onError: (error) => {
        console.error('生成策划方案失败:', error);
        message.error('生成策划方案失败，请稍后重试');
        setGenerating(false);
        setLoading(false);
      },
      onDone: () => {
        console.log('策划方案生成完成，最终内容长度:', finalContent.length);
        message.success('策划方案生成完成');
        setGenerating(false);
        setLoading(false);
        
        // 生成完成后自动保存
        if (finalContent && finalContent.trim() !== '') {
          console.log('准备保存策划方案...');
          savePlan(finalContent);
        } else {
          console.error('策划方案内容为空，无法保存');
          message.warning('策划方案内容为空，无法保存');
        }
      }
    });
  };

  // 格式化媒体平台显示
  const formatMediaPlat = (mediaPlat: string | string[]) => {
    if (!mediaPlat) return [];
    
    // 如果已经是数组，直接返回
    if (Array.isArray(mediaPlat)) {
      return mediaPlat;
    }
    
    // 尝试解析JSON字符串
    try {
      return JSON.parse(mediaPlat);
    } catch (e) {
      // 如果不是JSON，尝试按逗号分割
      return mediaPlat.split(',').map(item => item.trim());
    }
  };

  return (
    <div>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>档案详情</span>
            <Button 
              type="primary" 
              onClick={handleGeneratePlan}
              loading={loading}
              disabled={generating}
            >
              {hasExistingPlan ? '重新生成策划方案' : '生成策划方案'}
            </Button>
          </div>
        }
        style={{ marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <Title level={4}>{profile.nickname}</Title>
            <Space size={[0, 8]} wrap>
              <Tag color="blue">{profile.age}岁</Tag>
              <Tag color="purple">{profile.occupation}</Tag>
              {Array.isArray(formatMediaPlat(profile.mediaPlat)) && 
                formatMediaPlat(profile.mediaPlat).map((plat: string) => (
                  <Tag key={plat} color="green">{plat}</Tag>
                ))
              }
            </Space>
          </div>

          <Divider orientation="left">基本信息</Divider>
          <div>
            <Text strong>性格特点：</Text>
            <Paragraph>{profile.personalityTraits}</Paragraph>
          </div>
          <div>
            <Text strong>教育背景：</Text>
            <Paragraph>{profile.educationBackground}</Paragraph>
          </div>

          {profile.careerExperience && (
            <>
              <Divider orientation="left">经历信息</Divider>
              <div>
                <Text strong>职业经历：</Text>
                <Paragraph>{profile.careerExperience}</Paragraph>
              </div>
              <div>
                <Text strong>特殊经历：</Text>
                <Paragraph>{profile.specialExperience}</Paragraph>
              </div>
              <div>
                <Text strong>特别经历：</Text>
                <Paragraph>{profile.uniqueExperience}</Paragraph>
              </div>
              {profile.interests && (
                <div>
                  <Text strong>兴趣爱好：</Text>
                  <Paragraph>{profile.interests}</Paragraph>
                </div>
              )}
            </>
          )}

          {profile.targetTrack && (
            <>
              <Divider orientation="left">目标信息</Divider>
              <div>
                <Text strong>想做的赛道：</Text>
                <Paragraph>{profile.targetTrack}</Paragraph>
              </div>
              <div>
                <Text strong>目标受众：</Text>
                <Paragraph>{profile.targetAudience}</Paragraph>
              </div>
              <div>
                <Text strong>内容创作能力：</Text>
                <Paragraph>{profile.contentCreationAbility}</Paragraph>
              </div>
              <div>
                <Text strong>做账号的原因：</Text>
                <Paragraph>{profile.accountPurpose}</Paragraph>
              </div>
              <div>
                <Text strong>短期目标：</Text>
                <Paragraph>{profile.shortTermGoals}</Paragraph>
              </div>
              <div>
                <Text strong>对标账号：</Text>
                <Paragraph>{profile.benchmarkAccounts}</Paragraph>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* 策划方案结果 */}
      {(loading || planContent) && (
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>专属自媒体策划方案</span>
              {saving && <Tag color="processing">保存中...</Tag>}
            </div>
          }
          style={{ marginTop: '20px' }}
        >
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin tip="正在生成您的专属策划方案..." />
              <Paragraph style={{ marginTop: '20px' }}>
                请耐心等待，我们正在为您精心打造...
              </Paragraph>
            </div>
          )}
          
          {planContent && (
            <div 
              style={{ 
                whiteSpace: 'pre-wrap', 
                padding: '10px',
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            >
              {planContent}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MediaPlanResult;
