const app = getApp();

Page({
  data: {
    detailType: '',
    title: '',
    imgHost: app.globalData.imgHost,
    dataInfo: {},
    priceAdult: 0,
    rowData: {},
    // 互动功能数据
    isLiked: false,
    likeCount: 0,
    isCollected: false,
    isCommentInputVisible: false,
    comment: ''
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
  // 获取数据
  getInfo(id, type) {
    const tempUrl = {
      '0': 'applet/travel/scenic/',
      '1': 'applet/travel/recommend/',
      '2': 'applet/travel/recommend/',
      '3': 'applet/travel/strategy/',
    };
    app.request('get', `${tempUrl[type || '0']}${id}`, {}, (res) => {
      if (res.code == '0000') {
        const { name, content, priceAdult = 0 } = res.data;
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
          rowData: res.data,
          dataInfo: result,
          // 初始化互动数据
          likeCount: res.data.likeNum || 0,
          isLiked: res.data.isLike || false,
          isCollected: res.data.isCollect || false
        });
        return;
      }
      app.toast(res.data);
    });
  },

  // 点赞
  handleLike() {
    const newIsLiked = !this.data.isLiked;
    const newLikeCount = newIsLiked ? this.data.likeCount + 1 : this.data.likeCount - 1;

    this.setData({
      isLiked: newIsLiked,
      likeCount: newLikeCount
    });

    // 调用 mock 接口
    app.request('post', 'applet/travel/operation/like', {
      dataId: this.data.rowData.id,
      toUserId: this.data.rowData.createId,
      isLike: newIsLiked
    }, (res) => {
      if (res.code != '0000') {
        app.toast(res.msg);
        // 回滚状态
        this.setData({
          isLiked: !newIsLiked,
          likeCount: newIsLiked ? this.data.likeCount - 1 : this.data.likeCount + 1
        });
      }
    });
  },

  // 收藏
  handleCollect() {
    const newIsCollected = !this.data.isCollected;

    this.setData({
      isCollected: newIsCollected
    });

    // 调用 mock 接口
    app.request('post', 'applet/travel/operation/collect', {
      dataId: this.data.rowData.id,
      toUserId: this.data.rowData.createId,
      isCollect: newIsCollected
    }, (res) => {
      if (res.code != '0000') {
        app.toast(res.msg);
        // 回滚状态
        this.setData({
          isCollected: !newIsCollected
        });
      }
    });
  },

  // 显示评论输入框
  showCommentInput() {
    this.setData({
      isCommentInputVisible: true
    });
  },

  // 取消评论
  cancelComment() {
    this.setData({
      isCommentInputVisible: false,
      comment: ''
    });
  },

  // 评论输入
  bindKeyInput(e) {
    const val = e.detail.value.replace(/[\r\n]+/g, '');
    this.setData({
      comment: val
    });
  },

  // 提交评论
  submitComment() {
    if (!this.data.comment.trim()) {
      app.toast('评论内容不能为空');
      return;
    }

    // 调用 mock 接口
    app.request('post', 'applet/travel/comment/createUserComment', {
      dataId: this.data.rowData.id,
      parentId: 0,
      toUserId: null,
      content: this.data.comment
    }, (res) => {
      if (res.code == '0000') {
        app.toast('评论成功');
        this.setData({
          isCommentInputVisible: false,
          comment: ''
        });
        // 可以在这里刷新评论列表
      } else {
        app.toast(res.msg);
      }
    });
  },

  // 生成海报
  generatePoster() {
    wx.navigateTo({
      url: '/pages/generate_poster/index?dataId=' + this.data.rowData.id
    });
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
