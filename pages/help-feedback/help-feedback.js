const app = getApp()
const { helpItems } = require('../../utils/mockData')

Page({
  data: {
    helpItems: [],
    expandedIndex: -1,
    feedbackContent: '',
    feedbackContact: '',
    submitting: false
  },

  onLoad() {
    this.setData({ helpItems })
  },

  toggleExpand(e) {
    const { index } = e.currentTarget.dataset
    const expandedIndex = this.data.expandedIndex === index ? -1 : index
    this.setData({ expandedIndex })
  },

  onContentInput(e) {
    this.setData({ feedbackContent: e.detail.value })
  },

  onContactInput(e) {
    this.setData({ feedbackContact: e.detail.value })
  },

  validateFeedback() {
    const { feedbackContent } = this.data
    
    if (!feedbackContent || feedbackContent.trim() === '') {
      app.showToast('请输入反馈内容')
      return false
    }
    
    if (feedbackContent.length < 10) {
      app.showToast('反馈内容不能少于10个字')
      return false
    }
    
    return true
  },

  submitFeedback() {
    if (!this.validateFeedback()) return
    if (this.data.submitting) return
    
    this.setData({ submitting: true })
    app.showLoading('提交中...')
    
    setTimeout(() => {
      app.hideLoading()
      this.setData({ 
        submitting: false,
        feedbackContent: '',
        feedbackContact: ''
      })
      app.showToast('反馈提交成功', 'success')
    }, 1500)
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
