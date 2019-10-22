const app = getApp();

Page({
  data: {
    auth: false,
    route: '',
    full_loading: true
  },
  onLoad(options) {
    this.data.route = options.route ? decodeURIComponent(options.route) : '';

    app.login((token) => {
      app.user_data.token = token;
      app.get_auth((res) => {
        if (res) {
          app.checkUserAuth((res) => {
            if (res) {
              app.redirect_or_switch_or_index(this.data.route);
            } else {
              this.setData({
                auth: false,
                full_loading: false
              });
            }
          });
        } else {
          this.setData({
            auth: false,
            full_loading: false
          });
        }
      });
    });
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
})