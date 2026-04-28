App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    location: null
  },

  onLaunch() {
    this.checkLoginStatus();
    this.getUserLocation();
  },

  checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.isLoggedIn = true;
      }
    } catch (e) {
      console.error('检查登录状态失败', e);
    }
  },

  getUserLocation() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation();
        }
      }
    });
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        };
      },
      fail: (err) => {
        console.error('获取位置失败', err);
      }
    });
  },

  login(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
    try {
      wx.setStorageSync('userInfo', userInfo);
    } catch (e) {
      console.error('保存用户信息失败', e);
    }
  },

  logout() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    try {
      wx.removeStorageSync('userInfo');
    } catch (e) {
      console.error('清除用户信息失败', e);
    }
  },

  showToast(title, icon = 'none') {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    });
  },

  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    });
  },

  hideLoading() {
    wx.hideLoading();
  }
});
