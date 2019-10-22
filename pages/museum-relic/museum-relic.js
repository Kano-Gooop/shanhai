const app = getApp();

Page({
  data: {
    id: 0,
    voice: {},
    audio: null
  },
  onLoad(options) {
    this.data.id = options.id;
    this.voiceDetail();
  },
  onUnload() {
    this.audio.pause();
  },
  // 获取语音播报
  voiceDetail() {
    let post = {
      id: this.data.id
    };

    app.ajax(app.my_config.api + 'voiceDetail', post, (res) => {
      if (res.pic) {
        res.pic = app.my_config.base_url + res.pic;
      } else {
        res.pic = app.my_config.default_img;
      }
      this.setData({voice: res});
      this.audio = wx.createInnerAudioContext();
      this.audio.src = res.url;
    });
  },
  play() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  },
  back_home() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  onShareAppMessage: function (e) {
    wx.showShareMenu({
      withShareTicket: true,
      success: function () {
      }
    });
  }
})