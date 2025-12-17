const app = getApp()

Page({
  data: {
    dataId: '',
    posterTitle: '',
    posterDescription: '',
    availableImages: [],
    selectedImageIndex: 0,
    posterGenerated: false
  },

  onLoad(options) {
    if (options.dataId) {
      this.setData({
        dataId: options.dataId
      });
      this.loadTravelData();
    }
  },

  // 加载游记数据
  loadTravelData() {
    app.request('get', `applet/travel/strategy/${this.data.dataId}`, {}, (res) => {
      if (res.code == '0000') {
        const { name, content, image } = res.data;
        const images = image ? image.split(',') : [];

        this.setData({
          posterTitle: name,
          posterDescription: content.substring(0, 200),
          availableImages: images.map(img => app.globalData.imgHost + img)
        });
      }
    });
  },

  // 标题输入
  onTitleInput(e) {
    this.setData({
      posterTitle: e.detail.value
    });
  },

  // 描述输入
  onDescriptionInput(e) {
    this.setData({
      posterDescription: e.detail.value
    });
  },

  // 选择图片
  selectImage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedImageIndex: index
    });
  },

  // 生成海报
  generatePoster() {
    const ctx = wx.createCanvasContext('posterCanvas');

    // 设置背景
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, 300, 400);

    // 添加图片
    if (this.data.availableImages.length > 0) {
      const selectedImage = this.data.availableImages[this.data.selectedImageIndex];
      ctx.drawImage(selectedImage, 0, 0, 300, 200);
    }

    // 添加标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText(this.data.posterTitle, 150, 230);

    // 添加描述文字
    ctx.setFillStyle('#666666');
    ctx.setFontSize(12);
    ctx.setTextAlign('left');

    // 处理多行文字
    const descLines = this.wrapText(ctx, this.data.posterDescription, 260, 12);
    descLines.forEach((line, index) => {
      ctx.fillText(line, 20, 260 + index * 15);
    });

    // 添加水印或标识
    ctx.setFillStyle('#999999');
    ctx.setFontSize(10);
    ctx.setTextAlign('right');
    ctx.fillText('旅行小程序', 280, 390);

    // 绘制到画布
    ctx.draw(() => {
      this.setData({
        posterGenerated: true
      });
      wx.showToast({
        title: '海报生成成功',
        icon: 'success'
      });
    });
  },

  // 文字换行处理
  wrapText(ctx, text, maxWidth, lineHeight) {
    const arrText = text.split('');
    const lineTexts = [];
    let lineText = '';

    for (let i = 0; i < arrText.length; i++) {
      const testLine = lineText + arrText[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lineTexts.push(lineText);
        lineText = arrText[i];
      } else {
        lineText = testLine;
      }
    }

    lineTexts.push(lineText);
    return lineTexts;
  },

  // 保存海报到相册
  savePoster() {
    wx.canvasToTempFilePath({
      canvasId: 'posterCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.error('保存失败:', err);
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        console.error('转换图片失败:', err);
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享海报到朋友圈
  sharePoster() {
    wx.canvasToTempFilePath({
      canvasId: 'posterCanvas',
      success: (res) => {
        // 这里可以调用分享 API
        wx.showModal({
          title: '分享海报',
          content: '海报已生成，是否打开图片分享到朋友圈？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.previewImage({
                urls: [res.tempFilePath],
                showmenu: true
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('转换图片失败:', err);
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        });
      }
    });
  }
})
