import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message, Typography, Empty } from 'antd';
import { generateMediaPlanWithSSE, saveMediaPlan } from '../../services/mediaProfileService';
import { InfoCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Paragraph } = Typography;

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
  onViewDetail?: () => void;
}

const MediaPlanResult: React.FC<MediaPlanResultProps> = ({ profile, onViewDetail }) => {
  const [loading, setLoading] = useState(false);
  const [planContent, setPlanContent] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

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

  return (
    <div>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{profile.nickname} 的自媒体策划方案</span>
              <Button 
                type="link" 
                icon={<InfoCircleOutlined />} 
                onClick={onViewDetail}
              >
                查看档案详情
              </Button>
              {saving && <span style={{ color: '#1890ff' }}>保存中...</span>}
            </div>
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
        {/* 策划方案结果 */}
        {loading && !planContent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin tip="正在生成您的专属策划方案..." />
            <Paragraph style={{ marginTop: '20px' }}>
              请耐心等待，我们正在为您精心打造...
            </Paragraph>
          </div>
        ) : planContent ? (
          <div 
            style={{ 
              padding: '10px',
              lineHeight: '1.6',
              fontSize: '14px'
            }}
          >
            <ReactMarkdown>{planContent}</ReactMarkdown>
            {loading && (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <Spin size="small" />
                <span style={{ marginLeft: '10px', color: '#1890ff' }}>正在生成更多内容...</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Empty 
              description={
                <span>
                  尚未生成策划方案，点击上方"生成策划方案"按钮开始生成
                </span>
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default MediaPlanResult;
