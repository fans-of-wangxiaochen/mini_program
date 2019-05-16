const fs = wx.getFileSystemManager();

wx.cloud.init({
  env: 'test-f77484',
});

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  async tap() {
    await new Promise((resolve, reject) => {
      fs.rmdir({
        dirPath: wx.env.USER_DATA_PATH + '/tmp',
        recursive: true,
        success: () => {
          resolve();
        },
        fail: e => {
          console.log(e);
          resolve();
        },
      });
    });

    let filePath: string = await new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success: res => {
          let path = res.tempFilePaths[0];
          resolve(path);
        },
        fail: e => {
          // 未选择图片
          wx.hideLoading();
          reject(e);
        },
      });
    });

    wx.showLoading({
      title: '请求中...',
      mask: true,
    });

    let base64data = await new Promise((resolve, reject) => {
      fs.readFile({
        filePath,
        encoding: 'base64',
        success: res => {
          resolve(res.data);
        },
        fail: e => {
          wx.hideLoading();
          reject(e);
        },
      });
    });

    let result;

    try {
      result = await wx.cloud.callFunction({
        name: 'baiduAI',
        data: {
          base64data,
        },
      });
    } catch {
      wx.showModal({
        title: '出错啦',
        content: '',
        showCancel: false,
      });

      wx.hideLoading();

      return;
    }

    let cdfResult = await wx.cloud.downloadFile({
      fileID:
        'cloud://test-f77484.8c75-test-f77484-1254249920/tmp/' + result.result,
    });

    wx.showLoading({
      title: '加载中...',
      mask: true,
    });

    let data: string = await new Promise(resolve => {
      fs.readFile({
        filePath: cdfResult.tempFilePath,
        encoding: 'utf8',
        success: res => {
          resolve(<string>res.data);
        },
        fail: e => {
          wx.hideLoading();
          wx.showModal({
            title: '出错啦',
            content: JSON.stringify(e),
          });
        },
      });
    });

    await new Promise(resolve => {
      fs.mkdir({
        dirPath: wx.env.USER_DATA_PATH + '/tmp',
        success: () => {
          resolve();
        },
      });
    });

    filePath = wx.env.USER_DATA_PATH + '/tmp/' + new Date().getTime();

    await new Promise((resolve, reject) => {
      fs.writeFile({
        data,
        encoding: 'base64',
        filePath,
        success: () => {
          resolve();
        },
        fail: e => {
          reject(e);
          wx.hideLoading();
          wx.showModal({
            title: '出错啦',
            content: JSON.stringify(e),
          });
        },
      });
    });

    wx.hideLoading();

    wx.previewImage({
      current: filePath,
      urls: [filePath],
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {};
  },
});
