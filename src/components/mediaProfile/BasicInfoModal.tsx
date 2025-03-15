import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, message } from 'antd';
import { createMediaProfileBasic } from '../../services/mediaProfileService';

interface BasicInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (profileId: string) => void;
}

const BasicInfoModal: React.FC<BasicInfoModalProps> = ({ 
  visible, 
  onCancel, 
  onSuccess 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await createMediaProfileBasic(values);
      if (response.data.code === 0) {
        message.success('基本信息保存成功');
        onSuccess(response.data.data.id);
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
      title="个人基本信息"
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
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="请输入您的昵称" />
        </Form.Item>

        <Form.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <InputNumber min={1} max={120} style={{ width: '100%' }} placeholder="请输入您的年龄" />
        </Form.Item>

        <Form.Item
          name="occupation"
          label="职业（主标签）"
          rules={[{ required: true, message: '请输入职业' }]}
        >
          <Input placeholder="例如：设计师、教师、程序员等" />
        </Form.Item>

        <Form.Item
          name="personalityTraits"
          label="性格特点"
          rules={[{ required: true, message: '请输入性格特点' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的性格特点，例如：开朗、内向、细心等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="educationBackground"
          label="教育背景"
          rules={[{ required: false, message: '请输入教育背景' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的教育背景，例如：学历、专业等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="mediaPlat"
          label="自媒体平台"
          rules={[{ required: true, message: '请选择自媒体平台' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择您想要运营的自媒体平台"
            options={[
              { value: '抖音', label: '抖音' },
              { value: '快手', label: '快手' },
              { value: '小红书', label: '小红书' },
              { value: '微信公众号', label: '微信公众号' },
              { value: 'B站', label: 'B站' },
              { value: '知乎', label: '知乎' },
              { value: '微博', label: '微博' },
              { value: '其他', label: '其他' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BasicInfoModal;
