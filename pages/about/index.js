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
      let _this=this;

      wx.showLoading({
        title: "努力加载中...",
        mask: true,
      });
    
      wx.request({
          url: 'https://project.t.khs1994.com/article/1',
          
          success: function (res) {
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '页面加载错误',
                  content: '请稍后再试',
                });
                wx.hideLoading();
                return;
              }
              let data = app.towxml.toJson(res.data.content, 'markdown');
              data.theme = 'light';
              wx.hideLoading();
              _this.setData({
                article: data
              })
          },

          fail: function () {
              console.log('fail');
          }
       })
  }, 
});
