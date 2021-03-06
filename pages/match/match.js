const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    id: 0,
    article: {}
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.articleDetail();
  },
  articleDetail() {
    let post = {
      id: this.data.id,
    };

    app.ajax(app.my_config.api + 'articleDetail', post, (res) => {
      this.setData({article: res});
      let rich_text = res.content;
      rich_text = rich_text.replace(/\/ueditor\/php\/upload\//g, app.my_config.base_url.substr(0, app.my_config.base_url.length - 1) + '/ueditor/php/upload/');
      WxParse.wxParse('rich_text', 'html', rich_text, this);
    });
  },
  to_tiyan(e) {
    wx.navigateTo({ url: '../tiyan/tiyan'})
  }
})