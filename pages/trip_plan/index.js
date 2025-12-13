const app = getApp();

Page({
  data: {
    tripList: [],
    showCreateDialog: false,
    formData: {
      name: '',
      startDate: '',
      endDate: ''
    }
  },

  onLoad() {
    this.getTripList();
  },

  // 获取行程列表
  getTripList() {
    // Mock数据
    const mockTrips = [
      {
        id: 1,
        name: '周末上海之旅',
        startDate: '2024-12-21',
        endDate: '2024-12-22',
        days: 2,
        spotCount: 5,
        hotelCount: 1,
        restaurantCount: 3,
        createTime: '2024-12-15'
      },
      {
        id: 2,
        name: '北京五日游',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
        days: 5,
        spotCount: 12,
        hotelCount: 2,
        restaurantCount: 8,
        createTime: '2024-12-20'
      },
      {
        id: 3,
        name: '苏州园林一日游',
        startDate: '2024-12-28',
        endDate: '2024-12-28',
        days: 1,
        spotCount: 3,
        hotelCount: 0,
        restaurantCount: 2,
        createTime: '2024-12-22'
      }
    ];

    this.setData({
      tripList: mockTrips
    });
  },

  // 打开创建行程弹窗
  openCreateDialog() {
    this.setData({
      showCreateDialog: true,
      formData: {
        name: '',
        startDate: '',
        endDate: ''
      }
    });
  },

  // 关闭创建行程弹窗
  closeCreateDialog() {
    this.setData({
      showCreateDialog: false
    });
  },

  // 输入框变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;

    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 选择开始日期
  onStartDateChange(e) {
    this.setData({
      [`formData.startDate`]: e.detail.value
    });
  },

  // 选择结束日期
  onEndDateChange(e) {
    this.setData({
      [`formData.endDate`]: e.detail.value
    });
  },

  // 创建行程
  createTrip() {
    const { name, startDate, endDate } = this.formData;

    if (!name.trim()) {
      app.toast('请输入行程名称');
      return;
    }

    if (!startDate) {
      app.toast('请选择开始日期');
      return;
    }

    if (!endDate) {
      app.toast('请选择结束日期');
      return;
    }

    if (startDate > endDate) {
      app.toast('开始日期不能晚于结束日期');
      return;
    }

    // 计算天数
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Mock创建行程
    const newTrip = {
      id: Date.now(),
      name: name.trim(),
      startDate,
      endDate,
      days,
      spotCount: 0,
      hotelCount: 0,
      restaurantCount: 0,
      createTime: new Date().toISOString().split('T')[0]
    };

    this.setData({
      tripList: [newTrip, ...this.data.tripList],
      showCreateDialog: false
    });

    app.toast('行程创建成功');
  },

  // 进入行程详情
  goToTripDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/trip_plan/detail?id=${id}`
    });
  },

  // 删除行程
  deleteTrip(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '提示',
      content: '确定要删除这个行程吗？',
      success: (res) => {
        if (res.confirm) {
          const tripList = this.data.tripList.filter(item => item.id !== id);
          this.setData({
            tripList
          });
          app.toast('行程删除成功');
        }
      }
    });
  }
});
