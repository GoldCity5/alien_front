import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateMediaProfileGoals } from '../../services/mediaProfileService';

interface GoalsInfoModalProps {
  visible: boolean;
  profileId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const GoalsInfoModal: React.FC<GoalsInfoModalProps> = ({ 
  visible, 
  profileId,
  onCancel, 
  onSuccess 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await updateMediaProfileGoals(profileId, values);
      if (response.data.code === 0) {
        message.success('目标信息保存成功');
        onSuccess();
        form.resetFields();
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('表单提交错误:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="内容目标信息"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
        >
          完成
        </Button>
      ]}
      maskClosable={false}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="targetTrack"
          label="想做的赛道"
          rules={[{ required: false, message: '请输入想做的赛道' }]}
        >
          <Input.TextArea 
            placeholder="请描述您想做的内容赛道，如美食、旅行、教育等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="targetAudience"
          label="想吸引的人群"
          rules={[{ required: false, message: '请输入想吸引的人群' }]}
        >
          <Input.TextArea 
            placeholder="请描述您想吸引的目标受众，如年龄段、职业、兴趣等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="contentCreationAbility"
          label="内容创作能力"
          rules={[{ required: true, message: '请输入内容创作能力' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的内容创作能力，如文案、拍摄、剪辑等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="accountPurpose"
          label="做账号的原因"
          rules={[{ required: true, message: '请输入做账号的原因' }]}
        >
          <Input.TextArea 
            placeholder="请描述您做自媒体账号的原因和动机" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="shortTermGoals"
          label="短期目标"
          rules={[{ required: false, message: '请输入短期目标' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的短期目标，如粉丝数、收入等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="benchmarkAccounts"
          label="对标账号"
          rules={[{ required: false, message: '请输入对标账号' }]}
        >
          <Input.TextArea 
            placeholder="请列举您想要对标的账号，可以是具体账号名称或类型" 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoalsInfoModal;
