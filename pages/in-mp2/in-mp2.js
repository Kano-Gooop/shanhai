const app = getApp();

Page({
  data: {
    agree_info: { name: '同意签署合同', value: '1' },
    agree: false,
    order_sn: ''
  },
  onLoad: function (options) {
    this.data.order_sn = options.order_sn;
  },
  checkboxChange(e) {
    this.data.agree = e.detail.value.length > 0;
  },
  applySubmit: function () {
    if (!this.data.agree) {
      app.toast('需要同意签署合同');
    } else {
      this.pay(this.data.order_sn, () => {
        app.toast('支付成功');

        let in_mp = app.get_page('pages/in-mp/in-mp');
        if (in_mp) {
          in_mp.getStatus(() => {
            wx.navigateBack({ delta: 1 });
          });
        }
      });
    }
  },
  pay: function (order_sn, callback) {
    let post = {
      order_sn: order_sn
    };

    app.ajax(app.my_config.api + 'pay/pay', post, (res) => {
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: 'MD5',
        paySign: res.paySign,
        success() {
          if (callback) {
            callback();
          }
        },
        fail() {
          app.toast('支付失败');
        }
      })
    });
  }
});