const app = getApp()
const { getTimeDiff, getDistance } = require('../../utils/util')

Page({
  data: {
    favorites: [],
    loading: false
  },

  onLoad() {
    this.loadFavorites()
  },

  onShow() {
    this.loadFavorites()
  },

  loadFavorites() {
    this.setData({ loading: true })
    
    try {
      const favorites = wx.getStorageSync('favorites') || []
      
      const processedFavorites = favorites.map(job => ({
        ...job,
        timeAgo: getTimeDiff(job.createTime),
        isFavorite: true
      }))
      
      this.setData({
        favorites: processedFavorites,
        loading: false
      })
    } catch (e) {
      console.error('加载收藏失败', e)
      this.setData({ loading: false })
    }
  },

  goToJobDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?id=${id}`
    })
  },

  toggleFavorite(e) {
    const { id, index } = e.currentTarget.dataset
    
    try {
      const favorites = wx.getStorageSync('favorites') || []
      const newFavorites = favorites.filter(f => f.id !== id)
      
      wx.setStorageSync('favorites', newFavorites)
      
      const updatedFavorites = this.data.favorites.filter((_, i) => i !== index)
      
      this.setData({
        favorites: updatedFavorites
      })
      
      app.showToast('已取消收藏')
    } catch (e) {
      console.error('取消收藏失败', e)
      app.showToast('操作失败，请重试')
    }
  },

  onPullDownRefresh() {
    this.loadFavorites()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})
