// 导入配置
import { currentConfig } from '../config/config';

// 图片路径工具函数
const getProfileImageUrl = (imageName: string): string => {
  return `${currentConfig.cdnBaseUrl}${imageName}`;
};

// 图片名称常量
const IMAGE_NAMES = {
  baomaPic: '宝妈林霞.png',
  waimaiPic: '外卖员小李.png',
  teacherPic: '小学老师钰钰.png',
  studentPic: '大学生小崔.png',
  decoratorPic: '装修工人张师傅.png',
  fruitPic: '水果店老板华哥.png',
  coachPic: '健身教练小陈.png',
  coffeePic: '咖啡师小美.png',
  illustratorPic: '插画师若若.png',
  itPic: 'IT工程师老王.png',
  housekeeperPic: '家政阿姨张姐.png',
  bakerPic: '烘焙师小林.png',
  farmerPic: '农民伯伯老赵.png',
  doctorPic: '医生王医生.png',
  electricianPic: '电工师傅老李.png',
  accountantPic: '会计师小周.png',
  kindergartenTeacherPic: '幼儿园老师小丽.png',
  hairdresserPic: '美发师小赵.png',
  taxiDriverPic: '出租车司机老马.png',
  chefPic: '主厨老刘.png',
  floristPic: '花艺师小慧.png',
  photographerPic: '摄影师大鹏.png',
  shopOwnerPic: '网店店主小张.png'
};

// 策划广场数据接口
export interface PlazaProfile {
  id: string;
  name: string;
  image: string;
  description: string;
  position: string;
  contentDirection: string[];
  recommendedTopics: string[];
  operationSuggestions: string[];
}

// 策划广场数据
export const plazaProfiles: PlazaProfile[] = [
  {
    id: '1',
    name: '宝妈林霞',
    image: getProfileImageUrl(IMAGE_NAMES.baomaPic),
    description: '85后宝妈，热爱分享育儿经验和家庭生活',
    position: '生活记录博主 / 育儿达人',
    contentDirection: [
      '分享科学育儿知识和经验',
      '记录温馨有爱的家庭生活',
      '推荐实用的母婴好物'
    ],
    recommendedTopics: [
      '《如何让宝宝爱上吃饭的10个小妙招》',
      '《在家就能做的早教游戏》',
      '《宝宝成长必备好物清单》'
    ],
    operationSuggestions: [
      '每周发布3-4条育儿经验分享，包括图文和短视频，记录宝宝成长点滴',
      '每月制作1-2个育儿知识科普视频，时长控制在3-5分钟，内容要通俗易懂',
      '每周固定时间进行1次直播，回答粉丝育儿问题，增加互动性',
      '建立育儿交流群，定期分享育儿资料和经验，增强粉丝粘性',
      '与母婴品牌合作，分享真实使用体验，增加内容可信度',
      '定期举办线上育儿讲座，邀请专家参与，提升账号专业性'
    ]
  },
  {
    id: '2',
    name: '外卖员小李',
    image: getProfileImageUrl(IMAGE_NAMES.waimaiPic),
    description: '95后外卖小哥，大学毕业后选择送外卖，记录城市中的温暖故事和真实生活',
    position: '城市观察者 / 生活记录博主 / 外卖行业内容创作者',
    contentDirection: [
      '通过记录送外卖过程中遇到的人和事，展现城市中不同人群的生活状态',
      '分享外卖行业内幕和经验',
      '记录城市中不同群体的生活故事'
    ],
    recommendedTopics: [
      '《送外卖半年，我见过最暖心的10个顾客》',
      '《深夜送单到医院，意外拍到的医生护士们的加班日常》',
      '《外卖小哥遇到的95种情况，第一个就让人崩溃》',
      '《下雨天送外卖的秘密装备，让我效率提高30%》'
    ],
    operationSuggestions: [
      '每天记录1-2个送餐过程中的暖心故事，用短视频形式呈现',
      '每周制作1个外卖行业揭秘视频，分享送餐技巧和行业知识',
      '每月整理1次城市美食地图，推荐优质商家和特色美食',
      '定期发布外卖装备测评，分享实用工具和送餐经验',
      '与商家合作，拍摄美食制作过程，增加内容多样性',
      '建立粉丝群，分享优惠信息和美食推荐，增强互动'
    ]
  },
  {
    id: '3',
    name: '小学老师钰钰',
    image: getProfileImageUrl(IMAGE_NAMES.teacherPic),
    description: '90后小学语文老师，热爱教育事业，擅长创新教学方法',
    position: '教育工作者 / 语文教学达人',
    contentDirection: [
      '分享有趣的语文教学方法',
      '记录师生互动的温馨瞬间',
      '推荐适合孩子的课外读物'
    ],
    recommendedTopics: [
      '《让孩子爱上语文的10个小游戏》',
      '《如何培养孩子的阅读习惯》',
      '《写好作文的秘诀分享》'
    ],
    operationSuggestions: [
      '每周发布2-3个教学小技巧，用短视频形式展示课堂互动',
      '每月制作1个完整的教学案例视频，分享教学方法和心得',
      '定期整理学习资料包，分享给家长和学生，增加实用性',
      '每周固定时间进行1次直播答疑，解答家长教育问题',
      '与教育机构合作，分享优质教育资源，提升内容质量',
      '建立家长交流群，分享教育经验和学习资料，增强互动'
    ]
  },
  {
    id: '4',
    name: '大学生小崔',
    image: getProfileImageUrl(IMAGE_NAMES.studentPic),
    description: '在校大学生，热爱记录校园生活，分享学习经验',
    position: '校园生活博主 / 学习经验分享者',
    contentDirection: [
      '分享高效学习方法',
      '记录精彩校园生活',
      '推荐实用学习工具'
    ],
    recommendedTopics: [
      '《大学生必备学习神器推荐》',
      '《如何科学规划考研时间》',
      '《校园生活趣事分享》'
    ],
    operationSuggestions: [
      '每周发布2-3个校园生活vlog，记录学习日常和校园趣事',
      '每月制作1个学习经验分享视频，介绍高效学习方法',
      '定期整理学习资料包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，分享学习心得和答疑',
      '与教育机构合作，分享优质学习资源，提升内容质量',
      '建立学习交流群，分享学习资料和经验，增强互动'
    ]
  },
  {
    id: '5',
    name: '装修工人张师傅',
    image: getProfileImageUrl(IMAGE_NAMES.decoratorPic),
    description: '从业15年的装修师傅，专注分享装修技巧和经验',
    position: '装修达人 / 家居顾问',
    contentDirection: [
      '分享专业装修技巧',
      '揭秘装修行业内幕',
      '解答装修常见问题'
    ],
    recommendedTopics: [
      '《装修避坑指南》',
      '《家装材料选购技巧》',
      '《装修预算合理分配》'
    ],
    operationSuggestions: [
      '每周发布2-3个装修技巧视频，展示实际施工过程',
      '每月制作1个完整的装修案例视频，分享装修经验',
      '定期整理装修知识包，分享给业主，增加实用性',
      '每周固定时间进行1次直播答疑，解答装修问题',
      '与建材商家合作，分享产品使用体验，增加可信度',
      '建立装修交流群，分享装修经验和材料选购建议'
    ]
  },
  {
    id: '6',
    name: '水果店老板华哥',
    image: getProfileImageUrl(IMAGE_NAMES.fruitPic),
    description: '经营水果店多年，了解各类水果特性和挑选技巧',
    position: '水果达人 / 生鲜经营专家',
    contentDirection: [
      '分享水果挑选技巧',
      '介绍时令水果特点',
      '推荐水果搭配方案'
    ],
    recommendedTopics: [
      '《挑选水果的秘诀》',
      '《时令水果营养价值》',
      '《水果保存小技巧》'
    ],
    operationSuggestions: [
      '每天发布1-2个水果挑选技巧视频，展示水果品质',
      '每周制作1个水果知识科普视频，介绍水果营养价值',
      '定期整理水果保存和食用方法，分享给顾客',
      '每周固定时间进行1次直播，介绍新品和优惠活动',
      '与果农合作，拍摄水果种植过程，增加内容可信度',
      '建立顾客交流群，分享水果知识和优惠信息'
    ]
  },
  {
    id: '7',
    name: '健身教练小陈',
    image: getProfileImageUrl(IMAGE_NAMES.coachPic),
    description: '专业健身教练，擅长制定个性化训练计划',
    position: '健身达人 / 运动指导专家',
    contentDirection: [
      '分享科学健身方法',
      '制定训练计划建议',
      '推荐健康饮食搭配'
    ],
    recommendedTopics: [
      '《零基础健身入门指南》',
      '《科学饮食计划》',
      '《居家健身动作教学》'
    ],
    operationSuggestions: [
      '每周发布3-4个健身动作教学视频，详细讲解动作要领',
      '每月制作1个完整的训练计划视频，分享科学训练方法',
      '定期整理健身知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，指导粉丝训练动作',
      '与健身品牌合作，分享装备使用体验，增加可信度',
      '建立健身交流群，分享训练计划和饮食建议'
    ]
  },
  {
    id: '8',
    name: '咖啡师小美',
    image: getProfileImageUrl(IMAGE_NAMES.coffeePic),
    description: '专业咖啡师，热爱分享咖啡知识和冲泡技巧',
    position: '咖啡达人 / 饮品制作专家',
    contentDirection: [
      '分享咖啡冲泡技巧',
      '介绍咖啡豆知识',
      '推荐咖啡器具'
    ],
    recommendedTopics: [
      '《咖啡入门必备知识》',
      '《手冲咖啡技巧分享》',
      '《咖啡器具选购指南》'
    ],
    operationSuggestions: [
      '每周发布2-3个咖啡制作视频，展示不同咖啡的制作方法',
      '每月制作1个咖啡知识科普视频，介绍咖啡豆和器具',
      '定期整理咖啡知识包，分享给咖啡爱好者',
      '每周固定时间进行1次直播，展示咖啡制作过程',
      '与咖啡品牌合作，分享产品使用体验，增加可信度',
      '建立咖啡交流群，分享咖啡知识和优惠信息'
    ]
  },
  {
    id: '9',
    name: '插画师若若',
    image: getProfileImageUrl(IMAGE_NAMES.illustratorPic),
    description: '自由插画师，专注原创插画创作',
    position: '插画创作者 / 艺术工作者',
    contentDirection: [
      '分享插画创作过程',
      '教授绘画技巧',
      '推荐绘画工具'
    ],
    recommendedTopics: [
      '《插画入门技巧》',
      '《数位板使用教程》',
      '《原创插画故事》'
    ],
    operationSuggestions: [
      '每周发布2-3个绘画过程视频，展示创作技巧',
      '每月制作1个完整的插画教程视频，分享绘画方法',
      '定期整理绘画资料包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场创作和答疑',
      '与绘画品牌合作，分享工具使用体验，增加可信度',
      '建立绘画交流群，分享绘画技巧和创作灵感'
    ]
  },
  {
    id: '10',
    name: 'IT工程师老王',
    image: getProfileImageUrl(IMAGE_NAMES.itPic),
    description: '资深IT工程师，专注技术分享和经验交流',
    position: '技术专家 / 编程教育者',
    contentDirection: [
      '分享编程技术知识',
      '解析行业发展趋势',
      '推荐学习资源'
    ],
    recommendedTopics: [
      '《编程入门指南》',
      '《IT行业发展分析》',
      '《技术面试经验分享》'
    ],
    operationSuggestions: [
      '每周发布2-3个技术教程视频，讲解编程技巧',
      '每月制作1个完整的项目开发视频，分享开发经验',
      '定期整理技术资料包，分享给开发者，增加实用性',
      '每周固定时间进行1次直播，解答技术问题',
      '与技术品牌合作，分享工具使用体验，增加可信度',
      '建立技术交流群，分享开发经验和学习资源'
    ]
  },
  {
    id: '11',
    name: '家政阿姨张姐',
    image: getProfileImageUrl(IMAGE_NAMES.housekeeperPic),
    description: '专业家政服务人员，擅长家务整理和烹饪',
    position: '家政服务专家 / 生活整理达人',
    contentDirection: [
      '分享家务整理技巧',
      '教授烹饪方法',
      '推荐家居收纳方案'
    ],
    recommendedTopics: [
      '《家居收纳秘籍》',
      '《快手家常菜谱》',
      '《清洁保养小技巧》'
    ],
    operationSuggestions: [
      '每周发布2-3个家务技巧视频，展示清洁和收纳方法',
      '每月制作1个完整的家务教程视频，分享生活经验',
      '定期整理家务知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场演示家务技巧',
      '与家居品牌合作，分享产品使用体验，增加可信度',
      '建立家务交流群，分享生活技巧和清洁方法'
    ]
  },
  {
    id: '12',
    name: '烘焙师小林',
    image: getProfileImageUrl(IMAGE_NAMES.bakerPic),
    description: '专业烘焙师，热爱创作美味甜点',
    position: '烘焙达人 / 甜点制作专家',
    contentDirection: [
      '分享烘焙技巧',
      '教授甜点制作',
      '推荐烘焙工具'
    ],
    recommendedTopics: [
      '《新手烘焙入门》',
      '《人气甜点制作》',
      '《烘焙工具选购》'
    ],
    operationSuggestions: [
      '每周发布2-3个烘焙教程视频，展示甜点制作过程',
      '每月制作1个完整的烘焙课程视频，分享烘焙技巧',
      '定期整理烘焙配方包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场制作甜点',
      '与烘焙品牌合作，分享工具使用体验，增加可信度',
      '建立烘焙交流群，分享配方和制作技巧'
    ]
  },
  {
    id: '13',
    name: '农民伯伯老赵',
    image: getProfileImageUrl(IMAGE_NAMES.farmerPic),
    description: '经验丰富的农民，擅长农业种植和农产品加工',
    position: '农业专家 / 农产品加工师',
    contentDirection: [
      '分享农业种植技巧',
      '介绍农产品加工方法',
      '推荐农业工具'
    ],
    recommendedTopics: [
      '《农作物种植指南》',
      '《农产品加工技巧》',
      '《农业工具使用心得》'
    ],
    operationSuggestions: [
      '每周发布2-3个农业知识视频，展示种植和养殖技巧',
      '每月制作1个完整的农业教程视频，分享务农经验',
      '定期整理农业知识包，分享给农民朋友，增加实用性',
      '每周固定时间进行1次直播，现场展示农事操作',
      '与农业品牌合作，分享农资使用体验，增加可信度',
      '建立农业交流群，分享种植经验和市场信息'
    ]
  },
  {
    id: '14',
    name: '医生王医生',
    image: getProfileImageUrl(IMAGE_NAMES.doctorPic),
    description: '专业医生，擅长健康科普和医疗知识分享',
    position: '健康科普专家 / 医疗顾问',
    contentDirection: [
      '分享健康知识',
      '解答医疗问题',
      '推荐健康生活方式'
    ],
    recommendedTopics: [
      '《常见疾病预防》',
      '《健康生活方式》',
      '《医疗知识科普》'
    ],
    operationSuggestions: [
      '每周发布2-3个健康知识视频，讲解常见疾病预防',
      '每月制作1个完整的健康科普视频，分享医疗知识',
      '定期整理健康知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，解答健康问题',
      '与医疗机构合作，分享专业医疗知识，增加可信度',
      '建立健康交流群，分享健康知识和养生建议'
    ]
  },
  {
    id: '15',
    name: '电工师傅老李',
    image: getProfileImageUrl(IMAGE_NAMES.electricianPic),
    description: '资深电工，擅长电气维修和电路安装',
    position: '电气专家 / 电路安装顾问',
    contentDirection: [
      '分享电气维修技巧',
      '教授电路安装知识',
      '推荐电气工具'
    ],
    recommendedTopics: [
      '《电气维修入门》',
      '《电路安装技巧》',
      '《电气工具使用指南》'
    ],
    operationSuggestions: [
      '每周发布2-3个电工技巧视频，展示电路维修方法',
      '每月制作1个完整的电工教程视频，分享工作经验',
      '定期整理电工知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场演示维修技巧',
      '与电工品牌合作，分享工具使用体验，增加可信度',
      '建立电工交流群，分享维修经验和安全知识'
    ]
  },
  {
    id: '16',
    name: '会计师小周',
    image: getProfileImageUrl(IMAGE_NAMES.accountantPic),
    description: '专业会计师，擅长财务管理和税务筹划',
    position: '财务专家 / 税务顾问',
    contentDirection: [
      '分享财务管理知识',
      '教授税务筹划方法',
      '推荐财务工具'
    ],
    recommendedTopics: [
      '《财务管理入门》',
      '《税务筹划技巧》',
      '《财务工具使用指南》'
    ],
    operationSuggestions: [
      '每周发布2-3个财务知识视频，讲解会计和税务知识',
      '每月制作1个完整的财务教程视频，分享工作经验',
      '定期整理财务知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，解答财务问题',
      '与财务机构合作，分享专业财务知识，增加可信度',
      '建立财务交流群，分享财务知识和税务建议'
    ]
  },
  {
    id: '17',
    name: '幼儿园老师小丽',
    image: getProfileImageUrl(IMAGE_NAMES.kindergartenTeacherPic),
    description: '专业幼教老师，擅长幼儿教育和活动策划',
    position: '幼教专家 / 活动策划师',
    contentDirection: [
      '分享幼儿教育方法',
      '教授活动策划技巧',
      '推荐教育工具'
    ],
    recommendedTopics: [
      '《幼儿教育指南》',
      '《活动策划技巧》',
      '《教育工具推荐》'
    ],
    operationSuggestions: [
      '每周发布2-3个幼教技巧视频，展示教学互动方法',
      '每月制作1个完整的幼教教程视频，分享教学经验',
      '定期整理幼教资料包，分享给家长，增加实用性',
      '每周固定时间进行1次直播，解答家长教育问题',
      '与教育机构合作，分享优质教育资源，增加可信度',
      '建立家长交流群，分享教育经验和学习资料'
    ]
  },
  {
    id: '18',
    name: '美发师小赵',
    image: getProfileImageUrl(IMAGE_NAMES.hairdresserPic),
    description: '专业美发师，擅长发型设计和造型技巧',
    position: '发型设计师 / 造型专家',
    contentDirection: [
      '分享发型设计技巧',
      '教授造型方法',
      '推荐美发工具'
    ],
    recommendedTopics: [
      '《发型设计入门》',
      '《造型技巧分享》',
      '《美发工具使用指南》'
    ],
    operationSuggestions: [
      '每周发布2-3个发型设计视频，展示造型技巧',
      '每月制作1个完整的发型教程视频，分享设计经验',
      '定期整理发型知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场展示造型过程',
      '与美发品牌合作，分享产品使用体验，增加可信度',
      '建立美发交流群，分享造型技巧和产品推荐'
    ]
  },
  {
    id: '19',
    name: '出租车司机老马',
    image: getProfileImageUrl(IMAGE_NAMES.taxiDriverPic),
    description: '资深出租车司机，熟悉城市道路和交通规则',
    position: '城市向导 / 交通顾问',
    contentDirection: [
      '分享城市道路知识',
      '介绍交通规则',
      '推荐出行路线'
    ],
    recommendedTopics: [
      '《城市道路指南》',
      '《交通规则解读》',
      '《出行路线推荐》'
    ],
    operationSuggestions: [
      '每周发布2-3个城市探索视频，介绍特色景点和路线',
      '每月制作1个完整的城市指南视频，分享驾驶经验',
      '定期整理交通知识包，分享给乘客，增加实用性',
      '每周固定时间进行1次直播，分享城市见闻',
      '与旅游机构合作，分享城市特色，增加可信度',
      '建立乘客交流群，分享出行建议和优惠信息'
    ]
  },
  {
    id: '20',
    name: '主厨老刘',
    image: getProfileImageUrl(IMAGE_NAMES.chefPic),
    description: '专业厨师，擅长烹饪技巧和菜品创新',
    position: '烹饪专家 / 菜品创新师',
    contentDirection: [
      '分享烹饪技巧',
      '教授菜品创新方法',
      '推荐厨房工具'
    ],
    recommendedTopics: [
      '《烹饪入门指南》',
      '《菜品创新技巧》',
      '《厨房工具使用心得》'
    ],
    operationSuggestions: [
      '每周发布2-3个烹饪教程视频，展示菜品制作过程',
      '每月制作1个完整的烹饪课程视频，分享烹饪技巧',
      '定期整理菜谱包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场制作美食',
      '与食材品牌合作，分享产品使用体验，增加可信度',
      '建立美食交流群，分享菜谱和烹饪技巧'
    ]
  },
  {
    id: '21',
    name: '花艺师小慧',
    image: getProfileImageUrl(IMAGE_NAMES.floristPic),
    description: '专业花艺师，擅长花艺设计和植物养护',
    position: '花艺设计师 / 植物养护专家',
    contentDirection: [
      '分享花艺设计技巧',
      '教授植物养护知识',
      '推荐花艺工具'
    ],
    recommendedTopics: [
      '《花艺设计入门》',
      '《植物养护技巧》',
      '《花艺工具使用指南》'
    ],
    operationSuggestions: [
      '每周发布2-3个花艺设计视频，展示插花技巧',
      '每月制作1个完整的花艺教程视频，分享设计经验',
      '定期整理花艺知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场展示插花过程',
      '与花艺品牌合作，分享工具使用体验，增加可信度',
      '建立花艺交流群，分享设计技巧和养护知识'
    ]
  },
  {
    id: '22',
    name: '摄影师大鹏',
    image: getProfileImageUrl(IMAGE_NAMES.photographerPic),
    description: '专业摄影师，擅长人像摄影和风景拍摄',
    position: '摄影专家 / 视觉艺术家',
    contentDirection: [
      '分享摄影技巧',
      '教授后期处理方法',
      '推荐摄影器材'
    ],
    recommendedTopics: [
      '《摄影入门指南》',
      '《后期处理技巧》',
      '《摄影器材推荐》'
    ],
    operationSuggestions: [
      '每周发布2-3个摄影技巧视频，展示拍摄方法',
      '每月制作1个完整的摄影教程视频，分享拍摄经验',
      '定期整理摄影知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，现场展示拍摄过程',
      '与摄影品牌合作，分享器材使用体验，增加可信度',
      '建立摄影交流群，分享拍摄技巧和后期处理'
    ]
  },
  {
    id: '23',
    name: '网店店主小张',
    image: getProfileImageUrl(IMAGE_NAMES.shopOwnerPic),
    description: '成功网店店主，擅长电商运营和产品推广',
    position: '电商专家 / 产品推广顾问',
    contentDirection: [
      '分享电商运营经验',
      '教授产品推广方法',
      '推荐运营工具'
    ],
    recommendedTopics: [
      '《电商运营指南》',
      '《产品推广技巧》',
      '《运营工具使用心得》'
    ],
    operationSuggestions: [
      '每周发布2-3个电商运营视频，分享店铺管理经验',
      '每月制作1个完整的电商教程视频，分享运营技巧',
      '定期整理运营知识包，分享给粉丝，增加实用性',
      '每周固定时间进行1次直播，介绍新品和优惠活动',
      '与电商平台合作，分享运营经验，增加可信度',
      '建立商家交流群，分享运营技巧和市场信息'
    ]
  }
]; 