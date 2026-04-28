const app = getApp()
const { cities, jobTypes } = require('../../utils/mockData')

Page({
  data: {
    userInfo: null,
    nickname: '',
    expectedCity: '',
    expectedCityCode: '',
    expectedJob: '',
    expectedJobId: '',
    cityPickerVisible: false,
    jobPickerVisible: false,
    cityColumns: [],
    jobColumns: []
  },

  onLoad() {
    const cityColumns = cities.map(city => city.name)
    const jobColumns = jobTypes.slice(1).map(job => job.name)
    
    this.setData({
      cityColumns,
      jobColumns
    })
    
    this.initData()
  },

  initData() {
    const userInfo = app.globalData.userInfo
    
    if (userInfo) {
      this.setData({
        userInfo,
        nickname: userInfo.nickname || '',
        expectedCity: userInfo.expectedCity || '',
        expectedCityCode: userInfo.expectedCityCode || '',
        expectedJob: userInfo.expectedJob || '',
        expectedJobId: userInfo.expectedJobId || ''
      })
    }
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  openCityPicker() {
    this.setData({ cityPickerVisible: true })
  },

  closeCityPicker() {
    this.setData({ cityPickerVisible: false })
  },

  onCityChange(e) {
    const { value, index } = e.detail
    const city = cities[index]
    this.setData({
      expectedCity: city.name,
      expectedCityCode: city.code
    })
  },

  clearCity() {
    this.setData({
      expectedCity: '',
      expectedCityCode: '',
      cityPickerVisible: false
    })
  },

  openJobPicker() {
    this.setData({ jobPickerVisible: true })
  },

  closeJobPicker() {
    this.setData({ jobPickerVisible: false })
  },

  onJobChange(e) {
    const { value, index } = e.detail
    const job = jobTypes[index + 1]
    this.setData({
      expectedJob: job.name,
      expectedJobId: job.id
    })
  },

  clearJob() {
    this.setData({
      expectedJob: '',
      expectedJobId: '',
      jobPickerVisible: false
    })
  },

  validateForm() {
    const { nickname } = this.data
    
    if (!nickname || nickname.trim() === '') {
      app.showToast('请输入昵称')
      return false
    }
    
    return true
  },

  saveInfo() {
    if (!this.validateForm()) return
    
    app.showLoading('保存中...')
    
    setTimeout(() => {
      app.hideLoading()
      
      const updatedUserInfo = {
        ...this.data.userInfo,
        nickname: this.data.nickname,
        expectedCity: this.data.expectedCity,
        expectedCityCode: this.data.expectedCityCode,
        expectedJob: this.data.expectedJob,
        expectedJobId: this.data.expectedJobId
      }
      
      app.login(updatedUserInfo)
      app.showToast('保存成功', 'success')
      
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  }
})
