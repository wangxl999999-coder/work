const app = getApp()
const { mockJobs } = require('../../utils/mockData')
const { getTimeDiff, getDistance } = require('../../utils/util')

Page({
  data: {
    jobId: null,
    job: null,
    isFavorite: false,
    showContactModal: false,
    showMapModal: false,
    markers: [],
    polyline: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ jobId: parseInt(options.id) })
      this.loadJobDetail(parseInt(options.id))
    }
  },

  onShow() {
    this.checkFavorite()
  },

  loadJobDetail(jobId) {
    const job = mockJobs.find(j => j.id === jobId)
    
    if (job) {
      const processedJob = {
        ...job,
        timeAgo: getTimeDiff(job.createTime)
      }
      
      if (app.globalData.location) {
        processedJob.distance = getDistance(
          app.globalData.location.latitude,
          app.globalData.location.longitude,
          job.location.latitude,
          job.location.longitude
        )
      }
      
      const markers = [{
        id: 0,
        latitude: job.location.latitude,
        longitude: job.location.longitude,
        title: job.title,
        iconPath: '',
        width: 40,
        height: 40,
        callout: {
          content: job.address,
          fontSize: 12,
          borderRadius: 4,
          bgColor: '#ffffff',
          padding: 8,
          display: 'ALWAYS'
        }
      }]
      
      this.setData({
        job: processedJob,
        markers
      })
    }
  },

  checkFavorite() {
    if (!this.data.job) return
    
    try {
      const favorites = wx.getStorageSync('favorites') || []
      const isFavorite = favorites.some(f => f.id === this.data.job.id)
      this.setData({ isFavorite })
    } catch (e) {
      console.error('检查收藏状态失败', e)
    }
  },

  toggleFavorite() {
    const { job, isFavorite } = this.data
    
    if (!job) return
    
    try {
      const favorites = wx.getStorageSync('favorites') || []
      let newFavorites
      
      if (isFavorite) {
        newFavorites = favorites.filter(f => f.id !== job.id)
        app.showToast('已取消收藏')
      } else {
        newFavorites = [...favorites, job]
        app.showToast('已收藏', 'success')
      }
      
      wx.setStorageSync('favorites', newFavorites)
      this.setData({ isFavorite: !isFavorite })
    } catch (e) {
      console.error('收藏操作失败', e)
      app.showToast('操作失败，请重试')
    }
  },

  showContact() {
    this.setData({ showContactModal: true })
  },

  hideContactModal() {
    this.setData({ showContactModal: false })
  },

  makePhoneCall() {
    if (!this.data.job || !this.data.job.contact) return
    
    wx.makePhoneCall({
      phoneNumber: this.data.job.contact.phone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: (err) => {
        console.error('拨打电话失败', err)
      }
    })
  },

  copyPhone() {
    if (!this.data.job || !this.data.job.contact) return
    
    wx.setClipboardData({
      data: this.data.job.contact.phone,
      success: () => {
        app.showToast('已复制到剪贴板', 'success')
      }
    })
  },

  openMap() {
    this.setData({ showMapModal: true })
  },

  closeMapModal() {
    this.setData({ showMapModal: false })
  },

  getNavigation() {
    const { job } = this.data
    
    if (!job) return
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const startLat = res.latitude
        const startLng = res.longitude
        const endLat = job.location.latitude
        const endLng = job.location.longitude
        
        wx.openLocation({
          latitude: endLat,
          longitude: endLng,
          name: job.title,
          address: job.address,
          scale: 18
        })
      },
      fail: (err) => {
        console.error('获取位置失败', err)
        wx.openLocation({
          latitude: job.location.latitude,
          longitude: job.location.longitude,
          name: job.title,
          address: job.address,
          scale: 18
        })
      }
    })
  },

  onShareAppMessage() {
    const { job } = this.data
    
    if (!job) return {
      title: '找工作',
      path: '/pages/index/index'
    }
    
    return {
      title: `${job.title} - ${job.salary}`,
      path: `/pages/job-detail/job-detail?id=${job.id}`,
      imageUrl: ''
    }
  },

  onShareTimeline() {
    const { job } = this.data
    
    if (!job) return {
      title: '找工作'
    }
    
    return {
      title: `${job.title} - ${job.company}`,
      query: `id=${job.id}`,
      imageUrl: ''
    }
  },

  goBack() {
    wx.navigateBack()
  }
})
