// pages/upload/index.js

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: "/images/upload.svg",
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  chooseImageTap: function () {
    let _this = this;

    wx.chooseImage({
      count: 0,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let photo_array = res.tempFilePaths;
        _this.setData({
          photo: photo_array[0]
        });

        /*
        wx.saveFile({
          tempFilePath: photo_array[0],
          success: res => {
            console.log(res.savedFilePath);
          }
        });
        */
        wx.getSavedFileList({
          complete: res => {
            console.log(res);
          }
        });
      }
    })
  },

  bindSaveTap: function () {
    let _this = this;
    let startTime = (new Date()).valueOf();

    if (this.data.photo === '/images/upload.svg') {
      wx.showModal({
        title: '请选择图片',
        content: '点击上方图片，选择爱豆图片上传哟 😁',
        showCancel: false,
      })

      return;
    }

    wx.showLoading({
      title: "努力上传中...",
      mask: true
    });

    const uploadTask = wx.uploadFile({
      url: 'https://mini.cxyl.khs1994.com/photo/upload',
      filePath: _this.data.photo,
      name: 'photo',
      success: function (res) {
        wx.hideLoading();
        console.log('success');
        console.log(res);
        let finishTime = (new Date()).valueOf();
        let use_time = finishTime - startTime;
        use_time = use_time / 1000;

        let title;
        let message;

        if (res.statusCode === 200) {
          title = '成功 👍';
          message = `用时 ${use_time}s 这是我的爱豆`;
          _this.setData({
            photo: "/images/upload.svg"
          });
        } else if (res.statusCode === 304) {
          title = '确认过眼神，我遇见对的人 😎';
          message = '这是我的爱豆';
          _this.setData({
            photo: "/images/upload.svg"
          });
        } else if (res.statusCode === 500) {
          title = '这不是我的爱豆 😂';
          message = '我可是真爱粉，工程师虽然脸盲，但你骗不了我的火眼金睛';
          _this.setData({
            photo: "/images/upload.svg"
          });
        } else if (res.statusCode === 413) {
          title = '图片太大 😐'
          message = '请换一张图片试试';
        } else {
          title = '工程师外出 ✈';
          message = '服务器开小差了，请稍后再试';
        }

        wx.showModal({
          title: title,
          content: message,
          showCancel: false,
        })
      },
      fail: function (res) {
        console.log('fail');
        console.log(res);
        wx.hideLoading();
        let finishTime = (new Date()).valueOf();
        let use_time = finishTime - startTime;
        use_time = use_time / 1000;
        wx.showToast({
          title: `错误`,
          icon: 'none',
          duration: 2000
        })
      },
      complete: function () {
      }

    })

    uploadTask.onProgressUpdate(res => {
      if( res.progress === 100){
        wx.hideLoading();
        wx.showLoading({
          title: 'AI 引擎分析中',
          mask: true,
        })
      }
    })
  },

  imageLoad: function (e) {
    let _this = this;
    let $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例
    let viewWidth = 500,           //设置图片显示宽度，
      viewHeight = 500 / ratio;    //计算的高度值
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
