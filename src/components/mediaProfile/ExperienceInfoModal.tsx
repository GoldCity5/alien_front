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
      title="第一无二的经历(必填)

把你独特而又精彩的故事告诉天天,让天天成为最懂你的人"
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
      <div style={{ marginBottom: '16px', color: '#666' }}>
      把你独特而又精彩的故事告诉天天,让天天成为最懂你的人
      </div>
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="careerExperience"
          label="你的真实故事(职业经历或成长史)"
          rules={[{ required: true, message: '请输入职业经历' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的过往的经历,可以是职业经历、求学经历、社会经历万等等,写的越详细,天天越能帮助你,了解你。" 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="specialExperience"
          label="你有什么特殊的经历吗？"
          rules={[{ required: false, message: '请输入特殊经历' }]}
        >
          <Input.TextArea 
            placeholder="例如:支教/留学经历/获奖经历/创业十年...可能你觉得这些经历不算什么,不是的!这些都是你散发出来的耀眼光芒。你就是一个优秀的人!" 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="uniqueExperience"
          label="你有令你记忆深刻的挫折经历吗？"
          rules={[{ required: false, message: '请输入特别经历' }]}
        >
          <Input.TextArea 
            placeholder="例如:离婚、失业、经历过生死、负债1000w...我们都要感谢这些挫折,没有它们,就没有现在坚韧的自己,你远比自己以为的更扛造!" 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="interests"
          label="兴趣爱好"
          extra="如果不想把兴趣作为素材，可以不填"
        >
          <Input.TextArea 
            placeholder="请描述您的兴趣爱好,例如烹饪、摄影、骑行、编程等等" 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExperienceInfoModal;
