const cities = [
  { id: 1, name: '北京', code: 'bj' },
  { id: 2, name: '上海', code: 'sh' },
  { id: 3, name: '广州', code: 'gz' },
  { id: 4, name: '深圳', code: 'sz' },
  { id: 5, name: '杭州', code: 'hz' },
  { id: 6, name: '南京', code: 'nj' },
  { id: 7, name: '成都', code: 'cd' },
  { id: 8, name: '武汉', code: 'wh' },
  { id: 9, name: '西安', code: 'xa' },
  { id: 10, name: '重庆', code: 'cq' }
]

const jobTypes = [
  { id: 1, name: '全部' },
  { id: 2, name: '技术开发' },
  { id: 3, name: '产品经理' },
  { id: 4, name: '设计' },
  { id: 5, name: '销售' },
  { id: 6, name: '运营' },
  { id: 7, name: '市场' },
  { id: 8, name: '人事行政' },
  { id: 9, name: '财务' },
  { id: 10, name: '客服' }
]

const generateMockJobs = () => {
  const jobTitles = [
    'Java开发工程师', '前端开发工程师', '产品经理', 'UI设计师', '销售经理',
    '运营专员', '市场策划', '人事专员', '财务会计', '客服主管',
    'Python开发工程师', '数据分析师', '项目经理', '平面设计师', '渠道销售',
    '内容运营', '品牌推广', '行政主管', '出纳', '售后客服',
    'Android开发工程师', 'iOS开发工程师', '测试工程师', '交互设计师', '大客户销售'
  ]
  
  const companies = [
    '腾讯科技有限公司', '阿里巴巴集团', '百度网络技术有限公司', '字节跳动科技',
    '美团点评', '京东集团', '网易公司', '小米科技有限公司',
    '华为技术有限公司', '滴滴出行', '拼多多', '快手科技',
    '哔哩哔哩', '携程旅行网', '新浪公司', '搜狐公司'
  ]
  
  const salaries = [
    '8k-12k', '10k-15k', '12k-18k', '15k-20k', '18k-25k',
    '20k-30k', '25k-35k', '30k-40k', '35k-50k', '50k-70k'
  ]
  
  const addresses = [
    '北京市朝阳区建国路88号SOHO现代城', '上海市浦东新区陆家嘴金融中心',
    '广州市天河区珠江新城', '深圳市南山区科技园',
    '杭州市西湖区文三路', '南京市鼓楼区中山路',
    '成都市高新区天府大道', '武汉市洪山区光谷软件园',
    '西安市高新区锦业路', '重庆市渝中区解放碑'
  ]
  
  const locations = [
    { latitude: 39.9042, longitude: 116.4074 },
    { latitude: 31.2304, longitude: 121.4737 },
    { latitude: 23.1291, longitude: 113.2644 },
    { latitude: 22.5431, longitude: 114.0579 },
    { latitude: 30.2741, longitude: 120.1551 },
    { latitude: 32.0603, longitude: 118.7969 },
    { latitude: 30.5728, longitude: 104.0668 },
    { latitude: 30.5928, longitude: 114.3055 },
    { latitude: 34.3416, longitude: 108.9398 },
    { latitude: 29.5630, longitude: 106.5516 }
  ]
  
  const jobDetails = [
    '岗位职责：\n1. 负责公司产品的功能开发和维护；\n2. 参与产品需求分析和技术方案设计；\n3. 与产品、设计、测试团队紧密配合，确保项目按时交付；\n4. 持续优化代码质量和性能，提升用户体验。\n\n任职要求：\n1. 本科及以上学历，计算机相关专业；\n2. 3年以上相关工作经验；\n3. 熟悉相关技术栈，有扎实的编程基础；\n4. 良好的沟通能力和团队协作精神；\n5. 有大型项目经验者优先。',
    '我们正在寻找一位充满激情的人才加入我们的团队。如果你热爱技术，追求卓越，这里将是你施展才华的舞台。我们提供有竞争力的薪资待遇，完善的福利体系，以及广阔的发展空间。加入我们，一起创造更美好的未来！'
  ]
  
  const contacts = [
    { name: '张经理', phone: '13800138001' },
    { name: '李经理', phone: '13900139002' },
    { name: '王经理', phone: '13700137003' },
    { name: '赵经理', phone: '13600136004' },
    { name: '刘经理', phone: '13500135005' }
  ]
  
  const jobs = []
  const now = new Date().getTime()
  
  for (let i = 1; i <= 50; i++) {
    const randomDays = Math.floor(Math.random() * 30)
    const createTime = now - randomDays * 86400000
    const cityIndex = Math.floor(Math.random() * cities.length)
    const locationIndex = Math.min(cityIndex, locations.length - 1)
    
    jobs.push({
      id: i,
      title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      salary: salaries[Math.floor(Math.random() * salaries.length)],
      city: cities[cityIndex].name,
      cityCode: cities[cityIndex].code,
      address: addresses[locationIndex],
      location: locations[locationIndex],
      jobType: jobTypes[Math.floor(Math.random() * (jobTypes.length - 1)) + 1].name,
      jobTypeId: Math.floor(Math.random() * (jobTypes.length - 1)) + 2,
      detail: jobDetails[Math.floor(Math.random() * jobDetails.length)],
      contact: contacts[Math.floor(Math.random() * contacts.length)],
      createTime: new Date(createTime).toISOString(),
      views: Math.floor(Math.random() * 1000) + 100,
      isHot: Math.random() > 0.7,
      isUrgent: Math.random() > 0.8
    })
  }
  
  return jobs
}

const helpItems = [
  {
    id: 1,
    question: '如何发布工作岗位？',
    answer: '您可以通过以下步骤发布工作岗位：\n1. 登录账号后，在首页点击"发布"按钮；\n2. 填写岗位信息，包括岗位名称、薪资待遇、工作地点等；\n3. 上传公司相关证件（如需要）；\n4. 点击"发布"按钮完成发布。'
  },
  {
    id: 2,
    question: '如何搜索和筛选工作？',
    answer: '您可以通过以下方式搜索和筛选工作：\n1. 在首页顶部搜索框输入关键词进行搜索；\n2. 选择排序方式：距离排序、时间排序、综合排序；\n3. 点击右上角的"地区"按钮，按地区筛选工作。'
  },
  {
    id: 3,
    question: '如何收藏和分享工作？',
    answer: '收藏工作：\n1. 进入工作详情页；\n2. 点击页面底部的"收藏"按钮即可收藏。\n\n分享工作：\n1. 进入工作详情页；\n2. 点击右上角的"..."按钮；\n3. 选择"分享给朋友"或"分享到朋友圈"。'
  },
  {
    id: 4,
    question: '如何联系招聘经理？',
    answer: '联系招聘经理的方式：\n1. 进入工作详情页；\n2. 点击页面底部的"立即联系"按钮；\n3. 在弹出的窗口中点击电话号码即可拨打。'
  },
  {
    id: 5,
    question: '如何修改个人信息？',
    answer: '修改个人信息的步骤：\n1. 进入"我的"页面；\n2. 点击"完善信息"或头像区域；\n3. 修改需要更新的信息；\n4. 点击"保存"按钮完成修改。'
  },
  {
    id: 6,
    question: '忘记密码怎么办？',
    answer: '如果您忘记了密码：\n1. 在登录页面点击"忘记密码"；\n2. 输入注册时使用的手机号；\n3. 输入收到的验证码；\n4. 设置新密码并确认；\n5. 点击"确定"完成密码重置。'
  }
]

const mockJobs = generateMockJobs()

module.exports = {
  cities,
  jobTypes,
  mockJobs,
  helpItems,
  generateMockJobs
}
