const app = getApp()

Page({
  data: {
    userPoints: 1250,
    userLevel: 3,
    hasSignedToday: false,
    continuousSignDays: 5,
    continuousReward: 10,
    activeTab: 'records',
    pointsRecords: [
      { id: 1, title: '购买门票', time: '2024-01-10 14:30', amount: 100, type: 'income' },
      { id: 2, title: '发布游记', time: '2024-01-09 10:15', amount: 50, type: 'income' },
      { id: 3, title: '每日签到', time: '2024-01-08 09:00', amount: 10, type: 'income' },
      { id: 4, title: '兑换门票折扣券', time: '2024-01-07 16:45', amount: 200, type: 'expense' },
      { id: 5, title: '购买门票', time: '2024-01-06 11:20', amount: 100, type: 'income' },
      { id: 6, title: '每日签到', time: '2024-01-05 08:30', amount: 10, type: 'income' },
      { id: 7, title: '每日签到', time: '2024-01-04 09:15', amount: 10, type: 'income' },
      { id: 8, title: '发布游记', time: '2024-01-03 14:00', amount: 50, type: 'income' },
    ],
    exchangeItems: [
      { id: 1, name: '门票折扣券', description: '门票8折优惠', pointsRequired: 200, image: '/images/icons/menpiao.png' },
      { id: 2, name: '特色纪念品', description: '精美手工艺品', pointsRequired: 500, image: '/images/icons/luxian.png' },
      { id: 3, name: '美食优惠券', description: '餐厅9折优惠', pointsRequired: 150, image: '/images/icons/meishi.png' },
      { id: 4, name: '攻略手册', description: '旅游攻略合集', pointsRequired: 100, image: '/images/icons/gonglve.png' },
    ],
  },

  onLoad() {
    this.checkSignInStatus()
  },

  checkSignInStatus() {
    const today = new Date().toDateString()
    const lastSignDate = wx.getStorageSync('lastSignDate')
    const continuousSignDays = wx.getStorageSync('continuousSignDays') || 0
    const hasSignedToday = lastSignDate === today

    this.setData({
      hasSignedToday,
      continuousSignDays: hasSignedToday ? continuousSignDays : 0,
    })
  },

  signIn() {
    if (this.data.hasSignedToday) {
      app.toast('今日已签到')
      return
    }

    const today = new Date().toDateString()
    const lastSignDate = wx.getStorageSync('lastSignDate')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    let continuousSignDays = wx.getStorageSync('continuousSignDays') || 0
    if (lastSignDate === yesterdayStr) {
      continuousSignDays++
    } else {
      continuousSignDays = 1
    }

    let signReward = 10
    if (continuousSignDays >= 7) {
      signReward = 20
    } else if (continuousSignDays >= 3) {
      signReward = 15
    }

    this.setData({
      hasSignedToday: true,
      continuousSignDays,
      userPoints: this.data.userPoints + signReward,
    })

    wx.setStorageSync('lastSignDate', today)
    wx.setStorageSync('continuousSignDays', continuousSignDays)

    app.toast(`签到成功，获得${signReward}积分`)
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab,
    })
  },

  exchangeItem(e) {
    const item = e.currentTarget.dataset.item
    if (this.data.userPoints < item.pointsRequired) {
      app.toast('积分不足')
      return
    }

    wx.showModal({
      title: '确认兑换',
      content: `是否花费${item.pointsRequired}积分兑换${item.name}？`,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            userPoints: this.data.userPoints - item.pointsRequired,
          })
          app.toast('兑换成功')
        }
      },
    })
  },
})