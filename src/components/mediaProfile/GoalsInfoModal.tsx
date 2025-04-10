import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select, Checkbox } from 'antd';
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
  
  // 当表单数据从后端返回时，需要将字符串格式的accountPurpose转换为数组格式
  useEffect(() => {
    if (visible) {
      // 重置表单
      form.resetFields();
      
      // 如果有数据从后端返回，可以在这里处理
      // 示例代码，实际使用时可能需要从外部获取数据
      // 如果有初始值，可以在这里处理accountPurpose字符串转数组
      // const data = ...
      // if (data && data.accountPurpose && typeof data.accountPurpose === 'string') {
      //   form.setFieldsValue({
      //     ...data,
      //     accountPurpose: data.accountPurpose.split(',')
      //   });
      // }
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 将accountPurpose数组转换为逗号分隔的字符串
      const formattedValues = {
        ...values,
        accountPurpose: Array.isArray(values.accountPurpose) ? values.accountPurpose.join(',') : ''
      };
      
      const response = await updateMediaProfileGoals(profileId, formattedValues);
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
      <div style={{ marginBottom: '16px', color: '#666' }}>
      最后一步啦,属于你的专属自媒体策划方案马上就到
      </div>
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
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
          />
        </Form.Item>

        <Form.Item
          name="accountPurpose"
          label="做账号的原因（多选）"
          rules={[{ required: true, message: '请选择做账号的原因' }]}
        >
          <Checkbox.Group
            options={[
              { label: '分享爱好与生活', value: '分享爱好与生活' },
              { label: '赚钱', value: '赚钱' },
              { label: '个人IP打造', value: '个人IP打造' },
              { label: '社交和情感需求', value: '社交和情感需求' },
              { label: '知识分享', value: '知识分享' }
            ]}
            style={{ width: '100%' }}
          />
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
          />
        </Form.Item>

        <Form.Item
          name="targetTrack"
          label="想做的内容"
          rules={[{ required: false, message: '请输入想做的内容' }]}
        >
          <Input.TextArea 
            placeholder="请描述您想做的内容类型,如美食、旅行、教育等,要是没想好可以先不写哦" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="targetAudience"
          label="想吸引的人群"
          rules={[{ required: false, message: '请输入想吸引的人群' }]}
        >
          <Input.TextArea 
            placeholder="请描述您想吸引的目标受众,如年龄段、职业、兴趣等,没想好的话这个也可以不写" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="shortTermGoals"
          label="短期目标"
          rules={[{ required: false, message: '请输入短期目标' }]}
        >
          <Input.TextArea 
            placeholder="请描述您的短期目标,如粉丝数、收入等,如:3个月做到1万粉丝。" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="benchmarkAccounts"
          label="对标账号"
          rules={[{ required: false, message: '请输入对标账号' }]}
        >
          <Input.TextArea 
            placeholder="您觉得能参考的账号。请输入平台+账号。如:抖音的房琪kiki。" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="otherInfo"
          label="其他补充"
          rules={[{ required: false, message: '请输入其他补充信息' }]}
        >
          <Input.TextArea 
            placeholder="如有其他需要补充的信息,请在此说明。比如:不想露脸。" 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoalsInfoModal;
