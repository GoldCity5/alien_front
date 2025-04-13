import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateMediaProfileExperience } from '../../services/mediaProfileService';
import './mediaProfileExperience.css'; // 引入样式文件

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
      title="第一无二的经历"
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
      className="experience-modal"
    >
      <div className="modal-subtitle">
        把你独特而精彩的故事告诉小巷，让小巷成为最懂你的人
      </div>
      
      {/* 进度指示器 */}
      <div className="progress-steps">
        <div className="step completed">
          1
          <span className="step-label">个人档案</span>
        </div>
        <div className="step active">
          2
          <span className="step-label">经历信息</span>
        </div>
        <div className="step">
          3
          <span className="step-label">目标设置</span>
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <div className="form-section">
          <h3 className="form-section-title">职业与成长经历</h3>
          <Form.Item
            name="careerExperience"
            label="你的真实故事 (职业经历或成长史)"
            rules={[{ required: true, message: '请输入职业经历' }]}
          >
            <Input.TextArea 
              placeholder="请描述你的过往经历，可以是职业经历、学业经历、社会经历等等，写的越详细，小巷越能帮助你。" 
              rows={4}
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">特殊经历与挑战</h3>
          <Form.Item
            name="specialExperience"
            label="你有什么特殊的经历吗？"
            rules={[{ required: true, message: '请输入特殊经历' }]}
          >
            <Input.TextArea 
              placeholder="例如：留学/创业经历/求学经历/创业十年...可能你觉得这些经历不算什么，不是的！这些都是你散发出来的耀眼光芒，你就是一个优秀的人！" 
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="uniqueExperience"
            label="你有令你记忆深刻的挫折经历吗？"
            rules={[{ required: true, message: '请输入挫折经历' }]}
          >
            <Input.TextArea 
              placeholder="例如：离婚、失业、经历过生死、负债1000w...我们都要感谢这些挫折,没有它们,就没有现在坚韧的自己,你远比自己以为的更扛造！" 
              rows={4}
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">兴趣与爱好</h3>
          <Form.Item
            name="interests"
            label="兴趣爱好"
            extra="如果不想把这些作为素材，可以不填"
          >
            <Input.TextArea 
              placeholder="请描述您的兴趣爱好,例如烹饪、摄影、骑行、编程等等" 
              rows={3}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ExperienceInfoModal;
