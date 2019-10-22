const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    nomore: false,
    nodata: false,
    loading: false,
    page: 1,
    articleList: []
  },
  onLoad: function (options) {
    this.articleList();
  },
  onShow() {
    utils.select_tab_bar(this, 1);
  },
  articleList(complete) {
    let post = {
      page: this.data.page,
      perpage: 10
    };

    app.ajax(app.my_config.api + 'articleList', post, (res) => {
      if (res.list.length === 0) {
        if (this.data.page == 1) {
          this.setData({ nodata: true });
        } else {
          app.toast('暂无更多');
          this.setData({ nomore: true });
        }
      } else {
        for (let i = 0; i < res.list.length; i++) {
          if (res.list[i].pic) {
            res.list[i].pic = app.my_config.base_url + res.list[i].pic;
          } else {
            res.list[i].pic = app.my_config.default_img;
          }
        }

        this.data.articleList = this.data.articleList.concat(res.list);
        console.log(this.data.articleList, 111);

        this.setData({articleList: this.data.articleList});
      }

      this.data.page++;
    }, null, () => {
      if (complete) {
        complete();
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.data.nomore = false;
    this.data.nodata = false;
    this.data.page = 1;
    this.data.articleList = [];

    wx.showNavigationBarLoading();
    this.articleList(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },
  // 上拉加载
  onReachBottom() {
    if (!this.data.nomore && !this.data.nodata) {
      if (!this.data.loading) {
        this.data.loading = true;
        wx.showNavigationBarLoading();
        this.articleList(() => {
          wx.hideNavigationBarLoading();
          this.data.loading = false;
        });
      }
    }
  }
})