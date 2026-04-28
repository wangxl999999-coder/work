const app = getApp()

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    favoriteCount: 0
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.initData()
    this.getFavoriteCount()
  },

  initData() {
    const userInfo = app.globalData.userInfo
    const isLoggedIn = app.globalData.isLoggedIn
    
    this.setData({
      userInfo,
      isLoggedIn
    })
  },

  getFavoriteCount() {
    try {
      const favorites = wx.getStorageSync('favorites') || []
      this.setData({ favoriteCount: favorites.length })
    } catch (e) {
      console.error('获取收藏数量失败', e)
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  goToMyInfo() {
    if (!this.data.isLoggedIn) {
      this.goToLogin()
      return
    }
    wx.navigateTo({ url: '/pages/my-info/my-info' })
  },

  goToFavorites() {
    if (!this.data.isLoggedIn) {
      this.goToLogin()
      return
    }
    wx.navigateTo({ url: '/pages/my-favorites/my-favorites' })
  },

  goToHelpFeedback() {
    wx.navigateTo({ url: '/pages/help-feedback/help-feedback' })
  },

  goToAbout() {
    app.showToast('功能开发中...')
  },

  doLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({
            userInfo: null,
            isLoggedIn: false
          })
          app.showToast('已退出登录', 'success')
        }
      }
    })
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
      fail: (err) => {
        console.error('拨打电话失败', err)
      }
    })
  }
})
