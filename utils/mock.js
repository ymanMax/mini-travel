// mock 数据管理
const mockData = {
  // 论坛帖子列表
  'applet/travel/strategy/getPageList': {
    code: '0000',
    msg: '成功',
    data: {
      records: [
        {
          id: 1,
          name: '故宫博物院一日游',
          content: '今天去了故宫博物院，人真的很多。不过故宫的建筑真的很壮观，尤其是太和殿。建议大家早点去，避免排队。',
          image: 'http://example.com/image1.jpg,http://example.com/image2.jpg',
          createTime: '2025-10-15 10:30:00',
          isCollect: false,
          isLike: true,
          likeNum: 25,
          appletUserModel: {
            headPortraitLink: 'http://example.com/avatar1.jpg',
            nickName: '游客小王'
          },
          userCommentModelList: [
            {
              id: 101,
              userName: '游客小李',
              toUserName: null,
              content: '故宫真的值得一去！'
            },
            {
              id: 102,
              userName: '游客小张',
              toUserName: '游客小李',
              content: '是的，我去年去过，真的很棒！'
            }
          ]
        },
        {
          id: 2,
          name: '长城自驾游',
          content: '周末和朋友一起去了长城，开车去的，很方便。长城的风景真的很美，尤其是在秋天。建议大家穿舒适的鞋子，因为要走很多路。',
          image: 'http://example.com/image3.jpg',
          createTime: '2025-10-14 15:20:00',
          isCollect: true,
          isLike: false,
          likeNum: 18,
          appletUserModel: {
            headPortraitLink: 'http://example.com/avatar2.jpg',
            nickName: '旅游达人'
          },
          userCommentModelList: [
            {
              id: 201,
              userName: '游客小赵',
              toUserName: null,
              content: '请问一下，开车去长城方便吗？'
            }
          ]
        }
      ],
      current: 1,
      pages: 1
    }
  },

  // 景点列表
  'applet/travel/scenic/getPageList': {
    code: '0000',
    msg: '成功',
    data: {
      records: [
        { id: 1, name: '故宫博物院' },
        { id: 2, name: '长城' },
        { id: 3, name: '颐和园' },
        { id: 4, name: '天坛' },
        { id: 5, name: '北海公园' }
      ]
    }
  },

  // 点赞
  'applet/travel/operation/like': {
    code: '0000',
    msg: '成功'
  },

  // 收藏
  'applet/travel/operation/collect': {
    code: '0000',
    msg: '成功'
  },

  // 发布评论
  'applet/travel/comment/createUserComment': {
    code: '0000',
    msg: '评论成功'
  },

  // 发布游记
  'applet/travel/createTraStrategy': {
    code: '0000',
    msg: '发布成功'
  },

  // 图片上传
  'common/uploadImage': {
    code: '0000',
    msg: '上传成功',
    data: 'http://example.com/uploaded-image.jpg'
  }
};

// 获取 mock 数据
const getMockData = (url) => {
  // 移除 host 部分
  const path = url.replace('http://111.229.213.248:7002/', '');
  return mockData[path] || null;
};

module.exports = {
  getMockData
};
