const app = getApp();

Page({
  data: {
    full_loading: true,

    name: '',
    tel: '',

    is_pay: false,  // 用户是否已经购买套餐

    // 验证码相关
    code: '',
    code_text: '发送验证码',
    count_down: 60,
    code_disabled: false,
    code_flag: 0
  },
  onLoad() {
    this.checkPay(() => {
      this.setData({ full_loading: false });
    });
  },
  // 购买套餐下单支付
  order() {
    let data = this.data;

    if (!data.name.trim()) {
      app.toast('请填写姓名');
    } else if (!data.tel.trim()) {
      app.toast('请填写手机号');
    } else if (!app.my_config.reg.tel.test(data.tel)) {
      app.toast('手机号格式不正确');
    } else if (!data.code.trim()) {
      app.toast('请填写验证码');
    } else {
      let post = {
        name: data.name,
        tel: data.tel,
        code: data.code
      };

      wx.showLoading({
        title: '提交中',
        mask: true
      });
      app.ajax(app.my_config.api + 'order', post, res => {
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: 'MD5',
          paySign: res.paySign,
          success: () => {
            app.modal('成功购买套餐', () => {
              wx.hideLoading();
              wx.navigateTo({ url: '/pages/taocan-order/taocan-order' });
            });
          },
          fail: err => {
            wx.hideLoading();
            if (err.errMsg.indexOf('fail cancel')) {
              app.toast('取消支付')
            } else {
              app.toast('支付失败')
            }
          }
        });
      }, err => {
        wx.hideLoading();
        app.modal(err.message);
      });
    }
  },
  // 发送验证码
  sendSms() {
    if (!this.data.code_disabled) {
      if (!this.data.tel.trim()) {
        app.toast('请填写手机号');
      } else if (!app.my_config.reg.tel.test(this.data.tel)) {
        app.toast('手机号格式不正确');
      } else {
        this.setData({ code_disabled: true });

        app.ajax(app.my_config.api + 'sendSms', { tel: this.data.tel }, () => {
          app.toast('已发送');
          this.setData({ code_text: this.data.count_down + 's' });
          this.data.code_flag = setInterval(() => {
            this.data.count_down--;
            if (this.data.count_down === 0) {
              this.data.count_down = 60;
              this.setData({
                code_text: '发送验证码',
                code_disabled: false
              });
              clearInterval(this.data.code_flag);
            } else {
              this.setData({ code_text: this.data.count_down + 's' });
            }
          }, 1000)
        }, (err) => {
          app.toast(err.message);
          this.setData({ code_disabled: false });
        });
      }
    }
  },
  bind_input(e) {
    app.bind_input(e, this);
  },
  // 检测用户是否已支付
  checkPay(complete) {
    app.ajax(app.my_config.api + 'checkPay', null, res => {
      this.setData({ is_pay: res });
    }, null, () => {
      if (complete) {
        complete();
      }
    });
  }
});