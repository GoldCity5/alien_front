/**
 * 模拟内容选题生成服务
 * 用于在后端API实现之前进行前端测试
 */

// 模拟生成内容选题建议
export const mockGenerateContentTopic = (options: {
  contentDirection: string;
  targetAudience: string;
  platform: string;
  onMessage: (content: string) => void;
  onDone?: () => void;
  onStart?: () => void;
}) => {
  const { 
    contentDirection, 
    targetAudience, 
    platform, 
    onMessage, 
    onDone, 
    onStart 
  } = options;

  // 调用开始回调
  if (onStart) {
    onStart();
  }

  // 平台名称映射
  const platformNames: Record<string, string> = {
    douyin: '抖音',
    kuaishou: '快手',
    xiaohongshu: '小红书',
    bilibili: 'B站'
  };

  // 获取平台中文名
  const platformName = platformNames[platform] || platform;

  // 模拟内容片段
  const contentParts = [
    `# ${platformName}${contentDirection}内容选题建议\n\n`,
    `## 目标受众分析\n\n`,
    `根据您提供的信息，您的目标受众是${targetAudience}。这类受众有以下特点和需求：\n\n`,
    `1. **信息获取** - 他们希望通过${platformName}获取与${contentDirection}相关的专业知识和趋势。\n`,
    `2. **娱乐需求** - 他们同时也希望内容具有一定的娱乐性和吸引力。\n`,
    `3. **实用性** - 他们重视能够应用到实际生活中的内容和技巧。\n\n`,
    `## 内容选题建议\n\n`,
    `### 1. 热门趋势系列\n\n`,
    `* **${contentDirection}行业最新趋势解析** - 紧跟行业动态，提供专业见解\n`,
    `* **${platformName}平台${contentDirection}爆款内容分析** - 解析爆款背后的成功要素\n`,
    `* **${contentDirection}领域的创新案例分享** - 发掘并分析创新案例\n\n`,
    `### 2. 实用技巧系列\n\n`,
    `* **${contentDirection}入门指南** - 为新手提供基础知识和技巧\n`,
    `* **${contentDirection}进阶技巧** - 针对有一定基础的受众提供深度内容\n`,
    `* **${contentDirection}常见问题解答** - 解决目标受众的困惑和疑问\n\n`,
    `### 3. 行业洞察系列\n\n`,
    `* **${contentDirection}行业大咖访谈** - 邀请行业专家分享见解\n`,
    `* **${contentDirection}未来发展预测** - 提供前瞻性的行业分析\n`,
    `* **${contentDirection}成功案例解析** - 分析成功案例背后的关键因素\n\n`,
    `## 内容创作建议\n\n`,
    `1. **视觉吸引力** - 在${platformName}平台上，高质量的视觉效果是吸引用户的第一步\n`,
    `2. **内容节奏** - 保持适当的内容节奏，避免信息过载\n`,
    `3. **互动元素** - 加入问答、投票等互动元素增加用户参与度\n`,
    `4. **一致性** - 保持内容风格和发布频率的一致性，建立品牌认知\n\n`,
    `## 发布策略\n\n`,
    `* **最佳发布时间** - 根据${platformName}平台算法和目标受众活跃时间选择发布时间\n`,
    `* **内容组合** - 合理安排不同系列内容的发布顺序\n`,
    `* **话题标签** - 使用与${contentDirection}相关的热门话题标签增加曝光\n\n`,
    `希望以上建议对您的${platformName}${contentDirection}内容创作有所帮助！`
  ];

  // 模拟流式响应
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < contentParts.length) {
      onMessage(contentParts[index]);
      index++;
    } else {
      clearInterval(intervalId);
      if (onDone) {
        onDone();
      }
    }
  }, 500);

  // 返回取消函数
  return () => {
    clearInterval(intervalId);
  };
};
