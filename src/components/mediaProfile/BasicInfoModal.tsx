import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, message } from 'antd';
import { createMediaProfileBasic, updateMediaProfileBasic } from '../../services/mediaProfileService';
import './mediaProfileModal.css'; // 导入新的样式文件

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
    if (visible) {
      if (initialValues) {
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
      } else {
        // 如果是新建，重置表单
        form.resetFields();
      }
      
      // 重置滚动条位置的关键逻辑
      // 使用多个setTimeout确保DOM渲染完成后执行
      const resetScroll = () => {
        // 获取Modal的内容区域
        const modalContent = document.querySelector('.profile-modal .ant-modal-body');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
        
        // 获取Modal的包装元素
        const modalWrap = document.querySelector('.profile-modal .ant-modal-wrap');
        if (modalWrap) {
          modalWrap.scrollTop = 0;
        }
        
        // 获取表单容器
        const formContainer = document.querySelector('.profile-modal .modal-body');
        if (formContainer) {
          formContainer.scrollTop = 0;
        }
      };
      
      // 执行多次重置，确保在各种渲染情况下都能正确滚动到顶部
      setTimeout(resetScroll, 0);
      setTimeout(resetScroll, 50);
      setTimeout(resetScroll, 100);
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

  // 阻止滚轮默认行为的函数，防止滚动传递到父元素
  const preventScroll = (e: React.WheelEvent) => {
    const element = e.currentTarget as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // 如果已经滚动到顶部或底部，阻止事件冒泡
    if (
      (scrollTop === 0 && e.deltaY < 0) || 
      (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
    ) {
      e.stopPropagation();
    }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      width={650}
      className="profile-modal"
      closeIcon={null}
      style={{ top: 20 }}
      destroyOnClose={true}
    >
      <div className="modal-header">
        <div>
          <h2 className="modal-title">{isEditing ? "编辑基本信息" : "个人档案"}</h2>
          <p className="modal-subtitle">请按示例填写您的信息</p>
        </div>
        <button className="modal-close" onClick={onCancel}>×</button>
      </div>
      
      <div 
        className="modal-body"
        onWheel={preventScroll}
        style={{ 
          maxHeight: 'calc(100vh - 220px)', 
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {!isEditing && (
          <div className="progress-steps">
            <div className="step active">
              1
              <span className="step-label">个人档案</span>
            </div>
            <div className="step">
              2
              <span className="step-label">经历信息</span>
            </div>
            <div className="step">
              3
              <span className="step-label">目标设置</span>
            </div>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="profile-form"
          preserve={false}
        >
          <div className="form-section">
            <h3 className="form-section-title">基本信息</h3>
            
            <div className="form-group">
              <label className="form-label form-required" htmlFor="nickname">昵称</label>
              <Form.Item
                name="nickname"
                rules={[{ required: true, message: '请输入昵称' }]}
                noStyle
              >
                <Input 
                  id="nickname" 
                  placeholder="请输入您的昵称" 
                  className="ant-input form-input" 
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <label className="form-label form-required" htmlFor="age">年龄</label>
              <Form.Item
                name="age"
                rules={[{ required: true, message: '请输入年龄' }]}
                noStyle
              >
                <InputNumber 
                  id="age" 
                  min={1} 
                  max={120} 
                  style={{ width: '100%' }} 
                  placeholder="请输入您的年龄" 
                  className="ant-input-number form-input" 
                  controls={false}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <label className="form-label form-required" htmlFor="gender">性别</label>
              <Form.Item
                name="gender"
                rules={[{ required: true, message: '请选择性别' }]}
                noStyle
              >
                <Select
                  id="gender"
                  placeholder="请选择"
                  options={[
                    { value: '男', label: '男' },
                    { value: '女', label: '女' }
                  ]}
                  className="ant-select form-select"
                />
              </Form.Item>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">个人特质</h3>
            
            <div className="form-group">
              <label className="form-label form-required" htmlFor="occupation">主标签(身份职业)</label>
              <Form.Item
                name="occupation"
                rules={[{ required: true, message: '请输入职业' }]}
                noStyle
              >
                <Input 
                  id="occupation"
                  placeholder="例如：摆烂大学生、居家宝妈、多情程序员、感性律师..." 
                  className="ant-input form-input" 
                />
              </Form.Item>
              <p className="form-hint">这将成为您个人IP的重要特征，请尽量选择能体现个性的标签</p>
            </div>

            <div className="form-group">
              <label className="form-label form-required" htmlFor="personalityTraits">性格特点</label>
              <Form.Item
                name="personalityTraits"
                rules={[{ required: true, message: '请输入性格特点' }]}
                noStyle
              >
                <Input.TextArea 
                  id="personalityTraits"
                  placeholder="请描述您的性格特点，例如：高冷、青春、幽默、乐观、内向、外向、果敢、优柔寡断、务实、脆弱、外冷内热等" 
                  rows={3}
                  className="ant-input-textarea form-textarea"
                />
              </Form.Item>
              <p className="form-hint">您的性格特点将帮助我们为您打造更合适的内容风格</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="educationBackground">教育背景</label>
              <Form.Item
                name="educationBackground"
                rules={[{ required: false }]}
                noStyle
              >
                <Input.TextArea 
                  id="educationBackground"
                  placeholder="请描述您的教育背景，例如：心理学本科、哲学硕士等，不填也没关系" 
                  rows={3}
                  className="ant-input-textarea form-textarea"
                />
              </Form.Item>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">平台选择</h3>
            
            <div className="form-group">
              <label className="form-label form-required" htmlFor="mediaPlat">自媒体平台</label>
              <Form.Item
                name="mediaPlat"
                rules={[{ required: true, message: '请选择自媒体平台' }]}
                noStyle
              >
                <Select
                  id="mediaPlat"
                  placeholder="请选择您想要运营的自媒体平台"
                  options={[
                    { value: '抖音', label: '抖音' },
                    { value: '快手', label: '快手' },
                    { value: '小红书', label: '小红书' },
                    { value: '微信公众号', label: '微信公众号' },
                    { value: 'B站', label: 'B站' }
                  ]}
                  className="ant-select form-select"
                />
              </Form.Item>
              <p className="form-hint">选择您想要运营的平台</p>
            </div>
          </div>
          
          <div className="form-actions">
            <Button className="btn btn-secondary" onClick={onCancel}>
              取消
            </Button>
            <Button 
              className="btn btn-primary"
              type="primary"
              loading={loading}
              onClick={handleSubmit}
            >
              {isEditing ? '保存' : '下一步'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default BasicInfoModal;
