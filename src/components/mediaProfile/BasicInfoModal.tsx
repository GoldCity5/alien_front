import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, message } from 'antd';
import { createMediaProfileBasic, updateMediaProfileBasic } from '../../services/mediaProfileService';

interface BasicInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (profileId: string) => void;
  initialValues?: any;
  profileId?: string | null;
  isEditing?: boolean;
}

const BasicInfoModal: React.FC<BasicInfoModalProps> = ({ 
  visible, 
  onCancel, 
  onSuccess,
  initialValues,
  profileId,
  isEditing = false
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 当弹窗显示且有初始值时，设置表单值
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        nickname: initialValues.nickname,
        age: initialValues.age,
        gender: initialValues.gender,
        occupation: initialValues.occupation,
        personalityTraits: initialValues.personalityTraits,
        educationBackground: initialValues.educationBackground,
        // 如果mediaPlat是数组，取第一个元素
        mediaPlat: Array.isArray(initialValues.mediaPlat) && initialValues.mediaPlat.length > 0 
          ? initialValues.mediaPlat[0] 
          : initialValues.mediaPlat
      });
    } else if (visible && !initialValues) {
      // 如果是新建，重置表单
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 将mediaPlat转换为数组格式
      const formattedValues = {
        ...values,
        mediaPlat: values.mediaPlat ? [values.mediaPlat] : []
      };
      
      let response;
      if (isEditing && profileId) {
        // 编辑模式
        response = await updateMediaProfileBasic(profileId, formattedValues);
      } else {
        // 新建模式
        response = await createMediaProfileBasic(formattedValues);
      }
      
      if (response.data.code === 0) {
        message.success(isEditing ? '基本信息更新成功' : '基本信息保存成功');
        onSuccess(response.data.data.id || profileId);
        if (!isEditing) {
          form.resetFields();
        }
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
      title={isEditing ? "编辑基本信息" : "个人基本信息"}
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
          {isEditing ? "保存" : "下一步"}
        </Button>
      ]}
      maskClosable={false}
      width={600}
    >
      <div style={{ marginBottom: '16px', color: '#666' }}>
        请按示例填写您的信息
      </div>
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
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Select
            placeholder="请选择您的性别"
            options={[
              { value: '男', label: '男' },
              { value: '女', label: '女' },
              { value: '其他', label: '其他' }
            ]}
          />
        </Form.Item>

        <Form.Item
          name="occupation"
          label="主标签（身份职业）"
          rules={[{ required: true, message: '请输入职业' }]}
        >
          <Input placeholder="例如：摆烂大学生、居家宝妈、多情程序员、感性律师..." />
        </Form.Item>

        <Form.Item
          name="personalityTraits"
          label="性格特点"
          rules={[{ required: true, message: '请输入性格特点' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的性格特点,例如:高冷、毒舌、幽默、乐观、内向、外向
果敢、优柔寡断、务实、腹黑、外冷内热等" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="educationBackground"
          label="教育背景"
          rules={[{ required: false, message: '请输入教育背景' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的教育背景,例如:心理学本科、哲学硕士等,不填也没关系哦" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="mediaPlat"
          label="自媒体平台"
          rules={[{ required: true, message: '请选择自媒体平台' }]}
        >
          <Select
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
