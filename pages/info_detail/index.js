const app = getApp();

Page({
  data: {
    detailType: '',
    title: '',
    imgHost: app.globalData.imgHost,
    dataInfo: {},
    priceAdult: 0,
    rowData: {},
    // 天气相关数据
    weatherVisible: false,
    weatherData: {},
    clothingSuggestion: ''
  },
  onLoad(options) {
    this.setData({
      detailType: options.type,
    });
    this.getInfo(options.id, options.type);
  },
  toPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.rowData.phone,
    })
  },
  toPay() {
    app.globalData.orderInfo = this.data.rowData;
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },
  // 切换天气信息显示/隐藏
  toggleWeather() {
    this.setData({
      weatherVisible: !this.data.weatherVisible
    });

    // 如果是第一次显示天气，获取天气数据
    if (!this.data.weatherVisible && !this.data.weatherData.temperature) {
      this.getWeatherData();
    }
  },

  // 获取天气数据（mock）
  getWeatherData() {
    // 模拟根据景点经纬度获取天气
    // 这里使用mock数据
    const mockWeatherData = {
      scenicName: this.data.rowData.name || '未知景点',
      temperature: 22,
      weather: '晴',
      weatherIcon: 'sunny',
      forecast: [
        { date: '今天', weather: '晴', high: 25, low: 18 },
        { date: '明天', weather: '多云', high: 23, low: 17 },
        { date: '后天', weather: '阴', high: 21, low: 16 }
      ]
    };

    this.setData({
      weatherData: mockWeatherData
    });

    // 生成穿衣建议
    this.generateClothingSuggestion(mockWeatherData.temperature, mockWeatherData.weather);
  },

  // 生成穿衣建议
  generateClothingSuggestion(temperature, weather) {
    let suggestion = '';

    if (temperature >= 25) {
      suggestion = '天气较热，建议穿短袖衬衫、短裤、薄裙等清凉夏季服装。';
      if (weather.includes('雨')) {
        suggestion += ' 雨天请注意携带雨具。';
      }
    } else if (temperature >= 15) {
      suggestion = '天气适宜，建议穿长袖T恤、外套、长裤等春秋过渡服装。';
      if (weather.includes('雨')) {
        suggestion += ' 雨天请注意携带雨具，适当增加衣物。';
      }
    } else if (temperature >= 5) {
      suggestion = '天气较冷，建议穿毛衣、厚外套、长裤等冬季服装，注意保暖。';
      if (weather.includes('雨') || weather.includes('雪')) {
        suggestion += ' 雨雪天气请注意防滑，增加保暖衣物。';
      }
    } else {
      suggestion = '天气寒冷，建议穿羽绒服、厚毛衣、保暖裤等严寒服装，注意防冻保暖。';
      if (weather.includes('雪')) {
        suggestion += ' 雪天路滑，请注意安全。';
      }
    }

    this.setData({
      clothingSuggestion: suggestion
    });
  },

  // 获取数据（mock）
  getInfo(id, type) {
    // mock景点详情数据
    const mockData = {
      name: '故宫博物院',
      image: '/images/gugong.jpg',
      openHours: '08:30 - 17:00',
      address: '北京市东城区景山前街4号',
      description: '故宫博物院是在明、清两代皇宫及其收藏的基础上建立起来的中国综合性博物馆。其位于北京市中心，前通天安门，后倚景山，东近王府井街市，西临中南海。1961年，经国务院批准，故宫被定为全国第一批重点文物保护单位。1987年，故宫被联合国教科文组织列入“世界文化遗产”名录。',
      content: '# 故宫博物院\n\n## 景区介绍\n故宫博物院是中国最大的古代文化艺术博物馆，也是世界上现存规模最大、保存最为完整的木质结构古建筑群之一。\n\n## 主要景点\n- **太和殿**：俗称“金銮殿”，是故宫最大的宫殿\n- **中和殿**：皇帝参加大典前休息和接受朝拜的地方\n- **保和殿**：每年除夕皇帝赐宴外藩王公的场所\n- **乾清宫**：明清皇帝的寝宫和处理日常政务的地方\n\n## 历史意义\n故宫不仅是中国古代宫廷建筑的杰出代表，也是中国5000年文明历史的见证。',
      priceAdult: 60,
      phone: '010-85007421'
    };

    const { name, content, priceAdult = 0 } = mockData;
    let result = app.towxml(content,'markdown',{
      base: app.globalData.imgHost, // 相对资源的base路径
      theme: 'light', // 主题，默认`light`
      events:{  // 为元素绑定的事件方法
        tap:(e)=>{
          console.log('tap',e);
        }
      }
    });

    this.setData({
      title: name,
      priceAdult,
      rowData: mockData,
      dataInfo: result,
    });

    // 页面加载时获取天气数据
    this.getWeatherData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onShareTimeline() {
    
  }
});
