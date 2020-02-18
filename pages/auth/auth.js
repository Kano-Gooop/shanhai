const app = getApp();

Page({
  data: {
    auth: false,
    route: '',
    full_loading: true
  },
  onLoad(options) {
    if (options.route) {
      this.data.route = decodeURIComponent(options.route);
    } else if (options.q) {
      this.data.route = this.q_format(options.q);
    }

    app.login((token) => {
      app.user_data.token = token;

      app.redirect_or_switch_or_index(this.data.route);
      // app.get_auth((res) => {
      //   if (res) {
      //     app.checkUserAuth((res) => {
      //       if (res) {
      //         app.redirect_or_switch_or_index(this.data.route);
      //       } else {
      //         this.setData({
      //           auth: false,
      //           full_loading: false
      //         });
      //       }
      //     });
      //   } else {
      //     this.setData({
      //       auth: false,
      //       full_loading: false
      //     });
      //   }
      // });
    });
  },
  // 格式化通过二维码扫描进来的链接
  q_format(q) {
    q = decodeURIComponent(q);
    q = q.replace(app.my_config.base_url, '').split('?');
    let page = q[0], search = q[1];

    return search ? `pages/${page}/${page}?${search}` : `pages/${page}/${page}`;
  },
  auth(e) {
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '授权中',
        mask: true
      });

      app.userAuth((res) => {
        if (res) {
          app.redirect_or_switch_or_index(this.data.route);
        } else {
          app.toast('授权失败，请重新授权');
        }
      });
    }
  }
});