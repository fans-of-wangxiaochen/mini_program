import { IMyApp } from '../../app';
const app = getApp<IMyApp>();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    article: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.showLoading({
      title: '努力加载中...',
      mask: true,
    });

    const fs = wx.getFileSystemManager();
    let about_file_path = `${wx.env.USER_DATA_PATH}/about.txt`;
    let content;
    let markdown;
    this.about_file_path = about_file_path;

    // 检查缓存文件
    fs.access({
      path: about_file_path,
      // 缓存文件存在
      success: () => {
        console.log('about file exists');

        // 检查文件状态
        fs.stat({
          path: about_file_path,
          success: res => {
            // 文件过期
            let stats = <wx.Stats>res.stats;

            console.log(stats.lastModifiedTime);
            if (
              stats.lastModifiedTime >
              // @ts-ignore
              Math.round(new Date() / 1000) + 60 * 60
            ) {
              console.log('about file cache exprie');
              this.request_about_file();
            } else {
              console.log('about file cache create less than 1 hour');
              this.markdown();
            }
          },
        });
      },

      // 缓存文件不存在
      fail: res => {
        console.log('about file not exists, request');
        this.request_about_file();
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('onReady');
  },

  request_about_file: function() {
    console.log('request');

    let fs = wx.getFileSystemManager();

    wx.request({
      url: 'https://mini.cxyl.khs1994.com/article/1',

      success: (res: any) => {
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
        this.markdown();
      },

      fail: function() {
        console.log('request fail');
        let content = '# 页面请求错误';
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/about.txt`, content, 'utf8');
        this.markdown();
      },
    });
  },

  markdown: function() {
    let fs = wx.getFileSystemManager();
    // 读取缓存文件
    fs.readFile({
      filePath: this.about_file_path,
      encoding: 'utf8',
      success: res => {
        let content = res.data;
        let markdown = app.towxml.toJson(content, 'markdown');
        markdown.theme = 'light';
        this.setData({
          article: markdown,
        });
        wx.hideLoading();
      },
      fail: res => {
        console.log(res);
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {};
  },
});
