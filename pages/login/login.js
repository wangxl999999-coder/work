const app = getApp()

Page({
  data: {
    phone: '',
    password: '',
    showPassword: false
  },

  onLoad(options) {
    if (options.redirect) {
      this.setData({ redirect: decodeURIComponent(options.redirect) })
    }
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  validateForm() {
    const { phone, password } = this.data
    
    if (!phone || phone.trim() === '') {
      app.showToast('请输入手机号')
      return false
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      app.showToast('请输入正确的手机号')
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
    
    return true
  },

  doLogin() {
    if (!this.validateForm()) return
    
    app.showLoading('登录中...')
    
    setTimeout(() => {
      app.hideLoading()
      
      const userInfo = {
        id: 1,
        phone: this.data.phone,
        nickname: '用户' + this.data.phone.slice(-4),
        avatar: '',
        expectedCity: '',
        expectedCityCode: '',
        expectedJob: '',
        expectedJobId: '',
        createTime: new Date().toISOString()
      }
      
      app.login(userInfo)
      app.showToast('登录成功', 'success')
      
      setTimeout(() => {
        if (this.data.redirect) {
          wx.redirectTo({ url: this.data.redirect })
        } else {
          wx.switchTab({ url: '/pages/index/index' })
        }
      }, 1500)
    }, 1000)
  },

  goToRegister() {
    wx.navigateTo({ url: '/pages/register/register' })
  },

  goToForgetPassword() {
    app.showToast('功能开发中...')
  }
})
