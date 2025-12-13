const app = getApp();

Page({
  data: {
    tripId: null,
    tripInfo: {},
    tripSchedule: [],
    currentDay: 1,
    dayList: []
  },

  onLoad(options) {
    this.setData({
      tripId: options.id || null
    });
    this.getTripDetail();
  },

  // 获取行程详情
  getTripDetail() {
    if (!this.data.tripId) return;

    // Mock行程详情数据
    const mockTripDetail = {
      id: 1,
      name: '周末上海之旅',
      startDate: '2024-12-21',
      endDate: '2024-12-22',
      days: 2,
      description: '周末两天上海精华游，感受魔都魅力',
      spotCount: 5,
      hotelCount: 1,
      restaurantCount: 3,
      createTime: '2024-12-15'
    };

    // Mock行程安排数据
    const mockSchedule = [
      {
        id: 1,
        day: 1,
        time: '09:00',
        type: 'transport',
        name: '出发前往上海',
        address: '杭州东站',
        description: '乘坐G7358次高铁前往上海'
      },
      {
        id: 2,
        day: 1,
        time: '11:30',
        type: 'hotel',
        name: '上海外滩华尔道夫酒店',
        address: '上海市黄浦区中山东一路2号',
        description: '办理入住，豪华江景房'
      },
      {
        id: 3,
        day: 1,
        time: '12:30',
        type: 'restaurant',
        name: '南翔馒头店(豫园店)',
        address: '上海市黄浦区豫园路110号',
        description: '品尝上海地道小笼包'
      },
      {
        id: 4,
        day: 1,
        time: '14:00',
        type: 'spot',
        name: '豫园',
        address: '上海市黄浦区豫园老街279号',
        description: '游览江南古典园林，感受历史文化'
      },
      {
        id: 5,
        day: 1,
        time: '16:30',
        type: 'spot',
        name: '南京路步行街',
        address: '上海市黄浦区南京东路',
        description: '漫步中国最繁华的商业街'
      },
      {
        id: 6,
        day: 1,
        time: '18:30',
        type: 'restaurant',
        name: '老丰阁品珍轩(豫园店)',
        address: '上海市黄浦区豫园新路2号',
        description: '品尝本帮菜，感受上海味道'
      },
      {
        id: 7,
        day: 1,
        time: '20:00',
        type: 'spot',
        name: '外滩',
        address: '上海市黄浦区中山东一路',
        description: '欣赏外滩夜景，感受魔都魅力'
      },
      {
        id: 8,
        day: 2,
        time: '08:30',
        type: 'spot',
        name: '上海博物馆',
        address: '上海市黄浦区人民大道201号',
        description: '参观中国古代艺术博物馆'
      },
      {
        id: 9,
        day: 2,
        time: '11:30',
        type: 'restaurant',
        name: '绿波廊(豫园店)',
        address: '上海市黄浦区豫园路115号',
        description: '品尝上海传统小吃和本帮菜'
      },
      {
        id: 10,
        day: 2,
        time: '13:30',
        type: 'spot',
        name: '田子坊',
        address: '上海市黄浦区泰康路210弄',
        description: '游览文艺小资的老上海弄堂'
      },
      {
        id: 11,
        day: 2,
        time: '15:30',
        type: 'transport',
        name: '返回杭州',
        address: '上海虹桥站',
        description: '乘坐G7379次高铁返回杭州'
      }
    ];

    // 按天分组行程安排
    const dayScheduleMap = {};
    for (let i = 1; i <= mockTripDetail.days; i++) {
      dayScheduleMap[i] = mockSchedule.filter(item => item.day === i);
    }

    // 生成天数列表
    const dayList = [];
    for (let i = 1; i <= mockTripDetail.days; i++) {
      const date = new Date(mockTripDetail.startDate);
      date.setDate(date.getDate() + i - 1);
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
      dayList.push({
        day: i,
        date: dateStr
      });
    }

    this.setData({
      tripInfo: mockTripDetail,
      tripSchedule: dayScheduleMap,
      dayList: dayList
    });
  },

  // 切换天数
  switchDay(e) {
    const { day } = e.currentTarget.dataset;
    this.setData({
      currentDay: day
    });
  },

  // 导出行程单
  exportTrip() {
    wx.showLoading({
      title: '导出中...'
    });

    // Mock导出功能
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: '行程单已导出为PDF文件，可在本地查看',
        showCancel: false,
        confirmText: '知道了'
      });
    }, 1500);
  },

  // 分享行程
  shareTrip() {
    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: this.data.tripInfo.name || '我的行程',
      path: `/pages/trip_plan/detail?id=${this.data.tripId}`,
      imageUrl: '' // 可以设置自定义分享图片
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.tripInfo.name || '我的行程',
      query: `id=${this.data.tripId}`,
      imageUrl: '' // 可以设置自定义分享图片
    };
  },

  // 查看地点详情
  viewLocation(e) {
    const { address } = e.currentTarget.dataset;
    if (!address) return;

    // 使用地图查看位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          name: '目的地',
          address: address,
          scale: 18
        });
      },
      fail: () => {
        app.toast('获取位置失败，请检查权限设置');
      }
    });
  },

  // 添加行程安排
  addSchedule() {
    wx.showModal({
      title: '提示',
      content: '是否添加新的行程安排？',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到添加行程安排的页面
          app.toast('添加行程安排功能开发中...');
        }
      }
    });
  }
});
