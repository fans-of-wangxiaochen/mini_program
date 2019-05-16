// wx.cloud.init({
//   env: 'test-f77484'
// });

const cloud_folder = 'cloud://test-f77484.8c75-test-f77484/ins/';

Page({
  getNewList(count: number): string[] {
    let list = [];

    let end = count * 10;
    let i = count * 10 + 10;

    for (i; i > end; i--) {
      let number: string = i.toString();

      if (number.length < 2) {
        number = `00${i}`;
      } else if (number.length < 3) {
        number = `0${i}`;
      }

      list.push(cloud_folder + `${number}.jpg`);
    }
    console.log(list);
    return list;
  },

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    topHeight: 0,
    count: 10,
  },

  preview(res: any) {
    console.log(res);

    let current = res.currentTarget.dataset.name;

    wx.previewImage({
      current,
      urls: [current],
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });

    wx.getSystemInfo({
      success: res => {
        this.setData!({
          topHeight: res.statusBarHeight,
        });
      },
    });

    let count = this.data.count;
    let list = this.getNewList(count);

    this.setData({
      list,
      count: count - 1,
    });

    setTimeout(() => {
      wx.hideLoading();
    }, 2000);
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
  onReachBottom: function() {
    let count = this.data.count;

    console.log(count);

    if (count < 0) {
      wx.showModal({
        title: '没有了',
        content: '',
        showCancel: false,
      });

      return;
    }

    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    let list = this.getNewList(count);

    list = [...this.data.list, ...list];

    count = count - 1;

    this.setData({
      list,
      count,
    });

    setTimeout(() => {
      wx.hideLoading();
    }, 2000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {};
  },
});
