const app = getApp()

Page({
  data: {
    textarea_padding: '15rpx',
    expNotice: '',

    realname: '',
    tel: '',
    email: '',
    desc: ''
  },
  onLoad: function () {
    let phone = wx.getSystemInfoSync();
    if (phone.platform === 'ios') {
      this.setData({ textarea_padding: '0rpx' })
    }

    this.expNotice();
  },
  // 获取免费体验文案
  expNotice() {
    app.ajax(app.my_config.api + 'expNotice', null, (res) => {
      this.setData({expNotice: res});
    });
  },
  bind_input: function (e) {
    this.setData({ [e.currentTarget.dataset['name']]: e.detail.value || '' })
  },
  // 免费体验
  experience() {
    let data = this.data;
    if (!data.realname.trim()) {
      app.toast('请填写姓名');
    } else if (!data.tel.trim()) {
      app.toast('请填写手机号')
    } else if (!app.my_config.reg.tel.test(data.tel)) {
      app.toast('手机号格式不正确')
    } else if (!data.email.trim()) {
      app.toast('请填写邮箱')
    } else if (!app.my_config.reg.email.test(data.email)) {
      app.toast('邮箱格式不正确')
    } else {
      let post = {
        realname: data.realname,
        tel: data.tel,
        email: data.email,
        desc: data.desc
      };

      app.ajax(app.my_config.api + 'experience', post, () => {
        app.toast('提交成功');
        this.setData({
          realname: '',
          tel: '',
          email: '',
          desc: ''
        });
      });
    }

  }
})