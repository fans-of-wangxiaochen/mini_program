// pages/about/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let fs = wx.getFileSystemManager();
    let about_file_path = `${wx.env.USER_DATA_PATH}/about.txt`;
    let content;
    let markdown;
    _this.about_file_path = about_file_path;

    wx.showLoading({
      title: "努力加载中...",
      mask: true,
    });

    // 检查缓存文件
    fs.access({
      path: about_file_path,
      // 缓存文件存在
      success: () => {
        console.log('about file exists');

        // 检查文件状态
        fs.stat({
          path: about_file_path,
          success: (res) => {
            // 文件过期
            if (res.stats.lastModifiedTime > Math.round(new Date() / 1000) + 24 * 3600) {
              console.log('about file cache exprie');
              _this.request_about_file(_this);
            } else {
              console.log('about file cache create less than 1 day');
              _this.markdown(_this)
            }
          }
        })
      },

      // 缓存文件不存在
      fail: (res) => {
        console.log('about file not exists, request');
        _this.request_about_file(_this);
      }
    });

    // 手指触摸后马上离开
    this['eventRun_bind_tap'] = (event) => {

    };

    // 手指触摸动作开始
    this['eventRun_bind_touchstart'] = (event) => {

    };

    // 手指触摸后移动
    this['eventRun_bind_touchmove'] = (event) => {

    };

    // 手指触摸动作结束
    this['eventRun_bind_touchend'] = (event) => {

    };

    // 手指触摸动作被打断，如来电提醒，弹窗
    this['eventRun_bind_touchcancel'] = (event) => {

    };

    // deprecated replace by longpress
    this['eventRun_bind_longtap'] = (event) => {

    };

    // 手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发
    this['eventRun_bind_longpress'] = (event) => {

    };

    // 在支持 3D Touch 的 iPhone 设备，重按时会触发
    this['eventRun_bind_touchforcechange'] = (event) => {

    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  request_about_file: (_this) => {
    console.log('request');

    let fs = wx.getFileSystemManager();

    wx.request({
      url: 'https://mini.cxyl.khs1994.com/article/1',

      success: function (res) {
        if (res.statusCode !== 200) {
          wx.showModal({
            title: '页面加载错误',
            content: '请稍后再试',
          });
          wx.hideLoading();
          return;
        }

        let content = res.data.content;
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/about.txt`, content, 'utf8');
        _this.markdown(_this)
      },

      fail: function () {
        console.log('request fail');
        content = '# 页面请求错误';
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/about.txt`, content, 'utf8');
        _this.markdown(_this)
      }
    });
  },

  markdown: (_this) => {
    let fs = wx.getFileSystemManager();
    // 读取缓存文件
    fs.readFile({
      filePath: _this.about_file_path,
      encoding: 'utf8',
      success: (res) => {
        let content = res.data;
        let markdown = app.towxml.toJson(content,'markdown');
        markdown.theme = 'light';
        _this.setData({
          article: markdown,
        });
        wx.hideLoading();
      },
      fail: (res) => {
          console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage');
  }
});
