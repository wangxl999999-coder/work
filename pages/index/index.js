const app = getApp()
const { cities, mockJobs } = require('../../utils/mockData')
const { getTimeDiff, getDistance, debounce } = require('../../utils/util')

Page({
  data: {
    searchKeyword: '',
    jobs: [],
    filteredJobs: [],
    sortType: 'comprehensive',
    selectedCity: '',
    selectedCityCode: '',
    cityFilterVisible: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    refreshing: false,
    location: null
  },

  onLoad() {
    this.initData()
    this.getUserLocation()
  },

  onShow() {
    this.checkFavorites()
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true })
    this.refreshData()
  },

  onReachBottom() {
    this.loadMore()
  },

  initData() {
    const allJobs = this.processJobs(mockJobs)
    const initialJobs = allJobs.slice(0, this.data.pageSize)
    
    this.setData({
      jobs: allJobs,
      filteredJobs: initialJobs,
      hasMore: allJobs.length > this.data.pageSize,
      page: 1
    })
  },

  getUserLocation() {
    if (app.globalData.location) {
      this.setData({ location: app.globalData.location })
      this.updateJobsWithDistance()
      return
    }
    
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation()
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.getLocation()
            },
            fail: () => {
              console.log('用户拒绝授权位置')
            }
          })
        }
      }
    })
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        this.setData({ location })
        app.globalData.location = location
        this.updateJobsWithDistance()
      },
      fail: (err) => {
        console.error('获取位置失败', err)
      }
    })
  },

  updateJobsWithDistance() {
    const { location, jobs, filteredJobs, sortType } = this.data
    
    if (!location) return
    
    const updatedJobs = jobs.map(job => {
      const distance = getDistance(
        location.latitude,
        location.longitude,
        job.location.latitude,
        job.location.longitude
      )
      return { ...job, distance }
    })
    
    const updatedFilteredJobs = filteredJobs.map(job => {
      const distance = getDistance(
        location.latitude,
        location.longitude,
        job.location.latitude,
        job.location.longitude
      )
      return { ...job, distance }
    })
    
    this.setData({
      jobs: updatedJobs,
      filteredJobs: updatedFilteredJobs
    })
    
    if (sortType === 'distance') {
      this.sortJobs()
    }
  },

  processJobs(jobs) {
    return jobs.map(job => ({
      ...job,
      timeAgo: getTimeDiff(job.createTime),
      isFavorite: false
    }))
  },

  checkFavorites() {
    try {
      const favorites = wx.getStorageSync('favorites') || []
      const favoriteIds = favorites.map(f => f.id)
      
      const updatedJobs = this.data.jobs.map(job => ({
        ...job,
        isFavorite: favoriteIds.includes(job.id)
      }))
      
      const updatedFilteredJobs = this.data.filteredJobs.map(job => ({
        ...job,
        isFavorite: favoriteIds.includes(job.id)
      }))
      
      this.setData({
        jobs: updatedJobs,
        filteredJobs: updatedFilteredJobs
      })
    } catch (e) {
      console.error('检查收藏失败', e)
    }
  },

  onSearchInput: debounce(function(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.filterAndSearch()
  }, 300),

  onSearchConfirm() {
    this.filterAndSearch()
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterAndSearch()
  },

  toggleSort(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ sortType: type })
    this.sortJobs()
  },

  sortJobs() {
    const { sortType, filteredJobs, location } = this.data
    
    let sortedJobs = [...filteredJobs]
    
    switch (sortType) {
      case 'time':
        sortedJobs.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        break
      case 'distance':
        if (location) {
          sortedJobs.sort((a, b) => {
            const distA = parseFloat(a.distance) || 9999
            const distB = parseFloat(b.distance) || 9999
            return distA - distB
          })
        }
        break
      case 'comprehensive':
      default:
        sortedJobs.sort((a, b) => {
          const scoreA = (a.isHot ? 100 : 0) + (a.isUrgent ? 50 : 0) + a.views
          const scoreB = (b.isHot ? 100 : 0) + (b.isUrgent ? 50 : 0) + b.views
          return scoreB - scoreA
        })
    }
    
    this.setData({ filteredJobs: sortedJobs })
  },

  openCityFilter() {
    this.setData({ cityFilterVisible: true })
  },

  closeCityFilter() {
    this.setData({ cityFilterVisible: false })
  },

  selectCity(e) {
    const { city, code } = e.currentTarget.dataset
    this.setData({
      selectedCity: city,
      selectedCityCode: code,
      cityFilterVisible: false
    })
    this.filterAndSearch()
  },

  clearCityFilter() {
    this.setData({
      selectedCity: '',
      selectedCityCode: '',
      cityFilterVisible: false
    })
    this.filterAndSearch()
  },

  filterAndSearch() {
    const { searchKeyword, selectedCityCode, jobs, sortType, pageSize } = this.data
    
    let result = [...jobs]
    
    if (searchKeyword && searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.jobType.toLowerCase().includes(keyword)
      )
    }
    
    if (selectedCityCode) {
      result = result.filter(job => job.cityCode === selectedCityCode)
    }
    
    if (sortType === 'time') {
      result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    } else if (sortType === 'distance' && this.data.location) {
      result.sort((a, b) => {
        const distA = parseFloat(a.distance) || 9999
        const distB = parseFloat(b.distance) || 9999
        return distA - distB
      })
    } else {
      result.sort((a, b) => {
        const scoreA = (a.isHot ? 100 : 0) + (a.isUrgent ? 50 : 0) + a.views
        const scoreB = (b.isHot ? 100 : 0) + (b.isUrgent ? 50 : 0) + b.views
        return scoreB - scoreA
      })
    }
    
    const initialJobs = result.slice(0, pageSize)
    
    this.setData({
      filteredJobs: initialJobs,
      hasMore: result.length > pageSize,
      page: 1
    })
  },

  refreshData() {
    setTimeout(() => {
      this.initData()
      this.checkFavorites()
      this.setData({ refreshing: false })
      wx.stopPullDownRefresh()
      app.showToast('刷新成功', 'success')
    }, 1000)
  },

  loadMore() {
    if (this.data.loading || !this.data.hasMore) return
    
    this.setData({ loading: true })
    
    setTimeout(() => {
      const { page, pageSize, jobs, searchKeyword, selectedCityCode } = this.data
      
      let result = [...jobs]
      
      if (searchKeyword && searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase()
        result = result.filter(job => 
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.jobType.toLowerCase().includes(keyword)
        )
      }
      
      if (selectedCityCode) {
        result = result.filter(job => job.cityCode === selectedCityCode)
      }
      
      const startIndex = page * pageSize
      const nextJobs = result.slice(startIndex, startIndex + pageSize)
      
      const newFilteredJobs = [...this.data.filteredJobs, ...nextJobs]
      const hasMore = startIndex + pageSize < result.length
      
      this.setData({
        filteredJobs: newFilteredJobs,
        page: page + 1,
        hasMore,
        loading: false
      })
    }, 500)
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
      const job = this.data.filteredJobs[index]
      const isFavorite = !job.isFavorite
      
      let newFavorites
      if (isFavorite) {
        newFavorites = [...favorites, job]
        app.showToast('已收藏', 'success')
      } else {
        newFavorites = favorites.filter(f => f.id !== id)
        app.showToast('已取消收藏')
      }
      
      wx.setStorageSync('favorites', newFavorites)
      
      const updatedFilteredJobs = this.data.filteredJobs.map((j, i) => 
        i === index ? { ...j, isFavorite } : j
      )
      
      const updatedJobs = this.data.jobs.map(j => 
        j.id === id ? { ...j, isFavorite } : j
      )
      
      this.setData({
        filteredJobs: updatedFilteredJobs,
        jobs: updatedJobs
      })
    } catch (e) {
      console.error('收藏操作失败', e)
      app.showToast('操作失败，请重试')
    }
  }
})
