import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { updateMediaProfileGoals } from '../../services/mediaProfileService';
import './mediaProfileGoals.css'; // 引入新的样式文件

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 当表单数据从后端返回时，需要将字符串格式的accountPurpose转换为数组格式
  useEffect(() => {
    if (visible) {
      // 重置表单
      form.resetFields();
      setSelectedTags([]);
      
      // 重置滚动位置和聚焦
      setTimeout(() => {
        // 重置表单区域滚动位置
        const modalBody = document.querySelector('.goals-modal .ant-modal-body');
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
        
        // 重置modal整体滚动位置
        const modalWrap = document.querySelector('.goals-modal .ant-modal-wrap');
        if (modalWrap) {
          modalWrap.scrollTop = 0;
        }
        
        // 聚焦第一个输入框/选择框
        const firstSelect = document.querySelector('.goals-modal .ant-select');
        if (firstSelect) {
          (firstSelect as HTMLElement).click();
        }
      }, 100);
      
      // 如果有数据从后端返回，可以在这里处理
      // 示例代码，实际使用时可能需要从外部获取数据
      // 如果有初始值，可以在这里处理accountPurpose字符串转数组
      // const data = ...
      // if (data && data.accountPurpose && typeof data.accountPurpose === 'string') {
      //   const tagArray = data.accountPurpose.split(',');
      //   setSelectedTags(tagArray);
      //   form.setFieldsValue({
      //     ...data,
      //     accountPurpose: tagArray
      //   });
      // }
    }
  }, [visible, form]);

  const handleTagClick = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updatedTags);
    form.setFieldsValue({ accountPurpose: updatedTags });
  };

  const handleSubmit = async () => {
    try {
      // 验证标签选择是否为空
      if (selectedTags.length === 0) {
        message.error('请至少选择一个做账号的原因');
        return;
      }
      
      // 将选中的标签设置到表单中
      form.setFieldsValue({ accountPurpose: selectedTags });
      
      const values = await form.validateFields();
      setLoading(true);
      
      // 将accountPurpose数组转换为逗号分隔的字符串
      const formattedValues = {
        ...values,
        accountPurpose: Array.isArray(values.accountPurpose) ? values.accountPurpose.join(',') : ''
      };
      
      // 检查profileId是否存在
      if (!profileId) {
        message.error('用户档案ID不存在，请重试');
        setLoading(false);
        return;
      }
      
      const response = await updateMediaProfileGoals(profileId, formattedValues);
      if (response && response.data && response.data.code === 0) {
        message.success('目标信息保存成功');
        // 先重置表单和状态
        form.resetFields();
        setSelectedTags([]);
        // 关闭当前模态框
        onCancel();
        // 调用成功回调，通常用于页面跳转或刷新
        setTimeout(() => {
          onSuccess();
        }, 100);
      } else {
        message.error(response?.data?.message || '保存失败，请重试');
      }
    } catch (error: any) {
      console.error('表单提交错误:', error);
      message.error('提交表单时发生错误: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="自媒体制作能力和目标"
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
          生成方案
        </Button>
      ]}
      maskClosable={false}
      width={600}
      className="goals-modal"
      style={{ top: 20 }}
    >
      <div className="modal-subtitle">
        最后一步啦，展示你的专属自媒体策划方案马上就到啦！
      </div>
      
      {/* 进度指示器 */}
      <div className="progress-steps">
        <div className="step completed">
          1
          <span className="step-label">个人档案</span>
        </div>
        <div className="step completed">
          2
          <span className="step-label">经历信息</span>
        </div>
        <div className="step active">
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
          <h3 className="form-section-title">内容制作能力</h3>
          <Form.Item
            name="contentCreationAbility"
            label="内容创作能力"
            rules={[{ required: true, message: '请选择内容创作能力' }]}
          >
            <Select
              placeholder="请选择您的内容创作能力水平"
              options={[
                { value: '用手机简单操作', label: '用手机简单操作' },
                { value: '熟练用手机完成拍摄剪辑', label: '熟练用手机完成拍摄剪辑' },
                { value: '可以完成比较复杂的内容制作', label: '可以完成比较复杂的内容制作' }
              ]}
              className="form-select"
            />
          </Form.Item>

          <Form.Item
            name="accountPurpose"
            label="做账号的原因 (多选)"
            rules={[{ required: true, message: '请选择做账号的原因' }]}
          >
            <input type="hidden" />
            <div className="tag-selector" id="accountPurpose">
              <div 
                className={`tag-item ${selectedTags.includes('分享爱好与生活') ? 'selected' : ''}`} 
                data-value="分享爱好与生活"
                onClick={() => handleTagClick('分享爱好与生活')}
              >
                💭 分享爱好与生活
              </div>
              <div 
                className={`tag-item ${selectedTags.includes('赚钱') ? 'selected' : ''}`} 
                data-value="赚钱"
                onClick={() => handleTagClick('赚钱')}
              >
                📹 赚钱
              </div>
              <div 
                className={`tag-item ${selectedTags.includes('个人IP打造') ? 'selected' : ''}`} 
                data-value="个人IP打造"
                onClick={() => handleTagClick('个人IP打造')}
              >
                ⭐ 个人IP打造
              </div>
              <div 
                className={`tag-item ${selectedTags.includes('社交和情感需求') ? 'selected' : ''}`} 
                data-value="社交和情感需求"
                onClick={() => handleTagClick('社交和情感需求')}
              >
                👫 社交和情感需求
              </div>
              <div 
                className={`tag-item ${selectedTags.includes('知识分享') ? 'selected' : ''}`} 
                data-value="知识分享"
                onClick={() => handleTagClick('知识分享')}
              >
                📚 知识分享
              </div>
            </div>
          </Form.Item>
          
          <Form.Item
            name="availableTime"
            label="可以投入的时间"
            rules={[{ required: true, message: '请选择可以投入的时间' }]}
          >
            <Select
              placeholder="请选择您可以投入的时间"
              options={[
                { value: '每天1-2小时', label: '每天1-2小时' },
                { value: '每天3-4小时', label: '每天3-4小时' },
                { value: '每周1-2天', label: '每周1-2天' },
                { value: '全职投入', label: '全职投入' }
              ]}
              className="form-select"
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">内容与受众定位</h3>
          <Form.Item
            name="targetTrack"
            label="想做的内容"
            rules={[{ required: false, message: '请输入想做的内容' }]}
          >
            <Input.TextArea 
              placeholder="请描述您想做的内容类型，如旅游、美食、教育等，要越详细越好，要是没想好可以先不写哦" 
              rows={3}
              className="form-textarea"
            />
          </Form.Item>

          <Form.Item
            name="targetAudience"
            label="想吸引的人群"
            rules={[{ required: false, message: '请输入想吸引的人群' }]}
          >
            <Input.TextArea 
              placeholder="请描述您想吸引的目标受众，如年轻妈妈、职场人、大学生等，没想好的话这个也可以不写" 
              rows={3}
              className="form-textarea"
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">目标设定与参考</h3>
          <Form.Item
            name="shortTermGoals"
            label="短期目标"
            rules={[{ required: true, message: '请输入短期目标' }]}
          >
            <Input.TextArea 
              placeholder="请描述您的短期目标，如粉丝数、收入等，如：3个月做到1万粉丝..." 
              rows={3}
              className="form-textarea"
            />
          </Form.Item>

          <Form.Item
            name="benchmarkAccounts"
            label="对标账号 (选填)"
            rules={[{ required: false, message: '请输入对标账号' }]}
          >
            <Input.TextArea 
              placeholder="您想要参考的账号，请输入平台+账号，如：抖音的房琪kiki..." 
              rows={3}
              className="form-textarea"
            />
          </Form.Item>

          <Form.Item
            name="otherInfo"
            label="其他补充 (选填)"
            rules={[{ required: false, message: '请输入其他补充信息' }]}
          >
            <Input.TextArea 
              placeholder="如有其他需要补充的信息，请在此说明，比如：不想露脸..." 
              rows={3}
              className="form-textarea"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default GoalsInfoModal;
