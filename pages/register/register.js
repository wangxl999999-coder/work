const app = getApp()
const { cities, jobTypes } = require('../../utils/mockData')

Page({
  data: {
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    code: '',
    codeText: '获取验证码',
    codeDisabled: false,
    codeCountdown: 0,
    showPassword: false,
    showConfirmPassword: false,
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
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  toggleConfirmPassword() {
    this.setData({ showConfirmPassword: !this.data.showConfirmPassword })
  },

  getCode() {
    const { phone, codeDisabled, codeCountdown } = this.data
    
    if (codeDisabled || codeCountdown > 0) return
    
    if (!phone || phone.trim() === '') {
      app.showToast('请输入手机号')
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      app.showToast('请输入正确的手机号')
      return
    }
    
    this.setData({
      codeDisabled: true,
      codeCountdown: 60,
      codeText: '60s'
    })
    
    const timer = setInterval(() => {
      let countdown = this.data.codeCountdown - 1
      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({
          codeDisabled: false,
          codeCountdown: 0,
          codeText: '获取验证码'
        })
      } else {
        this.setData({
          codeCountdown: countdown,
          codeText: `${countdown}s`
        })
      }
    }, 1000)
    
    app.showToast('验证码已发送', 'success')
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

  validateForm() {
    const { phone, code, password, confirmPassword, nickname } = this.data
    
    if (!phone || phone.trim() === '') {
      app.showToast('请输入手机号')
      return false
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      app.showToast('请输入正确的手机号')
      return false
    }
    
    if (!code || code.trim() === '') {
      app.showToast('请输入验证码')
      return false
    }
    
    if (!nickname || nickname.trim() === '') {
      app.showToast('请输入昵称')
      return false
    }
    
    if (!password || password.trim() === '') {
      app.showToast('请输入密码')
      return false
    }
    
    if (password.length < 6) {
      app.showToast('密码长度不能少于6位')
      return false
    }
    
    if (!confirmPassword || confirmPassword.trim() === '') {
      app.showToast('请确认密码')
      return false
    }
    
    if (password !== confirmPassword) {
      app.showToast('两次输入的密码不一致')
      return false
    }
    
    return true
  },

  doRegister() {
    if (!this.validateForm()) return
    
    app.showLoading('注册中...')
    
    setTimeout(() => {
      app.hideLoading()
      
      const userInfo = {
        id: Date.now(),
        phone: this.data.phone,
        nickname: this.data.nickname,
        avatar: '',
        expectedCity: this.data.expectedCity,
        expectedCityCode: this.data.expectedCityCode,
        expectedJob: this.data.expectedJob,
        expectedJobId: this.data.expectedJobId,
        createTime: new Date().toISOString()
      }
      
      app.login(userInfo)
      app.showToast('注册成功', 'success')
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 1000)
  },

  goToLogin() {
    wx.navigateBack()
  }
})
