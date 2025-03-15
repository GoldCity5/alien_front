import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateMediaProfileExperience } from '../../services/mediaProfileService';

interface ExperienceInfoModalProps {
  visible: boolean;
  profileId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExperienceInfoModal: React.FC<ExperienceInfoModalProps> = ({ 
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
      
      const response = await updateMediaProfileExperience(profileId, values);
      if (response.data.code === 0) {
        message.success('经历信息保存成功');
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
      title="个人经历信息"
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
          下一步
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
          name="careerExperience"
          label="职业经历"
          rules={[{ required: true, message: '请输入职业经历' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的职业经历，包括工作内容、成就等" 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="specialExperience"
          label="你有什么特殊的经历吗？"
          rules={[{ required: false, message: '请输入特殊经历' }]}
        >
          <Input.TextArea 
            placeholder="例如：创业十年/留学经历/获奖经历..." 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="uniqueExperience"
          label="你有令你记忆深刻的挫折经历吗？"
          rules={[{ required: false, message: '请输入特别经历' }]}
        >
          <Input.TextArea 
            placeholder="例如：离婚、失业、经历过生死、负债1000w..." 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="interests"
          label="兴趣爱好"
          extra="如果不想把兴趣作为素材，可以不填"
        >
          <Input.TextArea 
            placeholder="请描述您的兴趣爱好" 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExperienceInfoModal;
