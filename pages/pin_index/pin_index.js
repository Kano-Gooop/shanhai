const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    active_index: 0
  },
  onLoad() {
  },
  // 选择拼图
  choose(e) {
    this.setData({active_index: e.currentTarget.dataset.index});
  },
  // 去拼图
  to_pin() {
    if (this.data.active_index === 0) {
      wx.navigateTo({ url: '/pages/pin/pin' });
    }
  },
  onShareAppMessage() {
    wx.showShareMenu();
    console.log(app.share_path());
    return { path: app.share_path() };
  }
});