const app = getApp()

Page({
  data: {
    linkman: '',
    tel: '',
    email: '',
    service_list: [
      {
        name: 'A套餐(¥19)', index: 0, value: 1, checked: 'true', service_content: `1.哈哈哈哈哈哈哈哈,
2.哈哈哈哈哈哈哈哈,
3.哈哈哈哈哈哈哈哈,
4.哈哈哈哈哈哈哈哈`
      },
      {
        name: 'B套餐(¥20)', index: 1, value: 2, service_content: `1.嘻嘻嘻嘻嘻嘻嘻嘻,
2.嘻嘻嘻嘻嘻嘻嘻嘻,
3.嘻嘻嘻嘻嘻嘻嘻嘻,
4.嘻嘻嘻嘻嘻嘻嘻嘻`
      },
      {
        name: 'C套餐(¥21)', index: 2, value: 3, service_content: `1.呵呵呵呵呵呵呵呵,
2.呵呵呵呵呵呵呵呵,
3.呵呵呵呵呵呵呵呵,
4.呵呵呵呵呵呵呵呵`
      }
    ],
    set: 0,
    cert: '',
    flag: 0,  // 0.第一次进, 1.资料填写未支付, 2.审核中, 3.审核未通过, 4.已入驻
    reason: '',
    loading: true
  },
  onLoad: function (e) {
    this.getStatus(() => {
      this.setData({loading: false});
    });
  },
  applySubmit: function () {
    if (!this.data.linkman.trim()) {
      app.toast('请填写联系人');
    } else if (!this.data.tel.trim()) {
      app.toast('请填写联系电话');
    } else if (!app.my_config.reg.tel.test(this.data.tel)) {
      app.toast('联系电话格式不正确');
    } else if (!this.data.email.trim()) {
      app.toast('请填写邮箱');
    } else if (!app.my_config.reg.email.test(this.data.email)) {
      app.toast('邮箱格式不正确');
      // } else if (!this.data.cert) {
      //   app.toast('请上传营业执照');
    } else {
      let post = {
        uid: wx.getStorageSync('USER_INFO').id,
        set: this.data.service_list[this.data.set].value,
        linkman: this.data.linkman,
        tel: this.data.tel,
        email: this.data.email
      };

      if (this.data.cert.indexOf('static/tmp') !== -1) {
        post.cert = this.data.cert.replace(app.my_config.base_url + '/', '');
      }

      app.ajax(app.my_config.api + 'api/order', post, (res) => {
        if (this.data.flag === 3) {
          this.getStatus();
        } else {
          wx.navigateTo({ url: '/pages/in-mp2/in-mp2?order_sn=' + res.order_sn });
        }
      });
    }
  },
  radioChange(e) {
    this.setData({ set: e.detail.value });
  },
  img_upload() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (res.tempFiles[0].size > 1048576) {
          app.toast('上传的图片不能大于1M');
        } else {
          wx.showLoading({
            title: '上传中',
            mask: true
          });
          wx.uploadFile({
            url: app.my_config.api + 'api/uploadImage',
            filePath: res.tempFiles[0].path,
            name: 'file',
            formData: {},
            success(res) {
              res = JSON.parse(res.data);
              that.setData({ cert: app.my_config.base_url + '/' + res.data.path });
            },
            fail: function () {
              app.toast('上传失败');
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      }
    })
  },
  img_remove() {
    this.setData({ cert: '' });
  },
  bind_input: function (e) {
    this.setData({ [e.currentTarget.dataset['name']]: e.detail.value || '' })
  },
  /*
  获取用户状态
  flag:
  0 第一次进页面,去填写资料
  1 资料已填写,未支付,去支付
  2 资料已填写,已支付,审核中状态
  3 资料已填写,已支付,审核未通过,重新填写资料,提交后,刷新页面
  4 已入驻
   */
  getStatus(callback) {
    let post = {
      uid: wx.getStorageSync('USER_INFO').id
    };

    app.ajax(app.my_config.api + 'api/getStatus', post, (res) => {
      let data = {
        flag: res.flag
      };
      switch (res.flag) {
        case 1:
        case 3:
        case 4:
          data.linkman = res.linkman;
          data.tel = res.tel;
          data.email = res.email;
          data.set = res.set - 1;
          data.cert = res.cert ? app.my_config.base_url + res.cert : '';

          if (res.flag === 3) {
            data.reason = res.reason;
          }
          break;
      }

      this.setData(data, () => {
        console.log(this.data.flag, '??', [0, 1, 3].indexOf(this.data.flag) != -1);
      });

      if (callback) {
        callback();
      }
    });
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.getStatus(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  }
});