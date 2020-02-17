const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    swiper: {
      indicator: true,
      autoplay: true,
      circular: true,  // 是否衔接滑动
      current: 0
    },

    // 地图
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      iconPath: '/icons/location.png',
      id: 0,
      longitude: 113.324520,
      latitude: 23.099994,
      width: 50,
      height: 50
    }],
    slidelist: [],
    id: 0,
    museum: {}
  },
  onLoad(options) {
    this.data.id = options.id;
    this.museumDetail();
  },
  museumDetail() {
    let post = {
      id: this.data.id
    };

    app.ajax(app.my_config.api + 'museumDetail', post, (res) => {
      if (res.detail.pic) {
        res.detail.pic = app.my_config.base_url + res.detail.pic;
      } else {
        res.detail.pic = app.my_config.default_img;
      }

      for (let i = 0; i < res.slidelist.length; i++) {
        if (res.slidelist[i].pic) {
          res.slidelist[i].pic = app.my_config.base_url + res.slidelist[i].pic;
        } else {
          res.slidelist[i].pic = app.my_config.default_img;
        }
      }

      wx.setNavigationBarTitle({ title: res.detail.title });
      this.setData({
        museum: res.detail,
        slidelist: res.slidelist,
        longitude: res.detail.lon,
        latitude: res.detail.lat,
        'markers[0].longitude': res.detail.lon,
        'markers[0].latitude': res.detail.lat
      });

      let rich_text = res.detail.content;
      rich_text = rich_text.replace(/\/ueditor\/php\/upload\//g, app.my_config.base_url.substr(0, app.my_config.base_url.length - 1) + '/ueditor/php/upload/');
      WxParse.wxParse('rich_text', 'html', rich_text, this);
    });
  },
  onShareAppMessage() {
    wx.showShareMenu();
    console.log(app.share_path());
    return { path: app.share_path() };
  }
});