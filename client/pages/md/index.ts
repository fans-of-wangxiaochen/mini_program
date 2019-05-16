// import { IMyApp } from '../../app';
// const app = getApp<IMyApp>();

import fetch from 'wx-fetch';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    markdown: '',
    unit_id: 'adunit-02a44e54e6494b36',
    isDark: false,
  },

  imageHandler: (markdown: string) => {
    let result = markdown.match(/\!\[.*?\)/g);

    if (result) {
      for (let item of result) {
        let img = item.split('(')[1].split(')')[0];

        if (img.match(/^http/g)) {
          // 图片地址为网址的不进行替换
          continue;
        }

        let new_item = `![](https://gitee.com/fans-of-wangxiaochen/magazine/raw/master${img})`;

        // console.log(item, new_item);
        markdown = markdown.replace(item, new_item);
      }
    }

    return markdown;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options: any) {
    wx.showLoading({
      title: '加载中...',
    });

    let url = options.url;

    fetch(url).then((res: any) => {
      let markdown = this.imageHandler(res.body);

      this.setData({
        markdown,
      });

      setTimeout(() => {
        wx.hideLoading();
      }, 1000);
    });
  },

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
