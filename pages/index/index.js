const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    swiper: {
      autoplay: true,
      interval: 3000,
      duration: 500,
      circular: true,  // 是否衔接滑动
      current: 0,
      image_list: []
    },
    tab: 1,

    // 页面滚动相关
    top_part1_height: 0,
    tab_part2_height: 0,
    top_height: 0,
    top_fixed: false,
    page_top: 0,
    padding_top: 0,

    home_article: {},  // 首页资讯
    case_list: [],  // 案例列表
    partner_list: [],  // 合作伙伴
    museum_list: [],  // 博物馆列表
    star_relic: {},  // 明星文物
    video: '',  // 视频
    video_context_list: [],
    minipro: [],  // 小程序列表
    longImg: [],  // 长图

    loading: false
  },
  onLoad() {
    this.homeSlide();
    this.homeArticle();
    this.caseList();
    this.partnerList();
    this.museumList();
    this.star_relic();
    this.getVideo();
    this.getLongImg();
    this.minipro();
  },
  onShow() {
    utils.select_tab_bar(this, 0);

    app.get_rect('.top-swiper', (rect) => {
      if (rect) {
        this.data.top_part1_height = rect.height;
      }
    })

    app.get_rect('.tab', (rect) => {
      if (rect) {
        this.data.tab_part2_height = rect.height + 20;
      }
    })

    app.get_rect('.top', (rect) => {
      if (rect) {
        this.data.top_height = rect.height;
      }
    })
  },
  // swiper改变，切换类
  swiper_change(e) {
    this.setData({
      'swiper.current': e.detail.current
    })
  },
  // 首页上面tab切换
  tab_change(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
  },
  // 页面滚动切换tab样式
  onPageScroll(e) {
    if (e.scrollTop > this.data.top_part1_height) {
      this.setData({
        top_fixed: true,
        page_top: -this.data.top_part1_height,
        padding_top: this.data.top_height
      });
    } else {
      this.setData({
        top_fixed: false,
        page_top: 0,
        padding_top: 0
      });
    }
  },
  // 顶部轮播
  homeSlide(complete) {
    app.ajax(app.my_config.api + 'homeSlide', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].pic) {
          res[i].pic = app.my_config.base_url + res[i].pic;
        } else {
          res[i].pic = app.my_config.default_img;
        }
      }

      this.setData({ 'swiper.image_list': res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 文创内容
  homeArticle(complete) {
    app.ajax(app.my_config.api + 'homeArticle', null, (res) => {
      if (res.pic) {
        res.pic = app.my_config.base_url + res.pic;
      } else {
        res.pic = app.my_config.default_img;
      }

      this.setData({ home_article: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 案例列表star_relic
  caseList(complete) {
    app.ajax(app.my_config.api + 'caseList', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].pic) {
          res[i].pic = app.my_config.base_url + res[i].pic;
        } else {
          res[i].pic = app.my_config.default_img;
        }
      }

      this.setData({ case_list: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 合作伙伴
  partnerList(complete) {
    app.ajax(app.my_config.api + 'partnerList', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].pic) {
          res[i].pic = app.my_config.base_url + res[i].pic;
        } else {
          res[i].pic = app.my_config.default_img;
        }
      }

      this.setData({ partner_list: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 博物馆列表
  museumList(complete) {
    app.ajax(app.my_config.api + 'museumList', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].pic) {
          res[i].pic = app.my_config.base_url + res[i].pic;
        } else {
          res[i].pic = app.my_config.default_img;
        }
      }

      this.setData({ museum_list: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 明星文物
  star_relic(complete) {
    app.ajax(app.my_config.api + 'star_relic', null, (res) => {
      if (res.pic) {
        res.pic = app.my_config.base_url + res.pic;
      } else {
        res.pic = app.my_config.default_img;
      }

      this.setData({ star_relic: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 获取视频
  getVideo(complete) {
    app.ajax(app.my_config.api + 'getVideo', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].poster) {
          res[i].poster = app.my_config.base_url + res[i].poster;
        } else {
          res[i].poster = app.my_config.default_img;
        }
        res[i].video_url = app.my_config.base_url + res[i].video_url;
        this.data.video_context_list.push(wx.createVideoContext('video' + i));
      }

      this.setData({ video: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  // 长图
  getLongImg(complete) {
    app.ajax(app.my_config.api + 'getLongImg', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          res[i] = app.my_config.base_url + res[i];
        } else {
          res[i] = app.my_config.default_img;
        }
      }
      this.setData({ longImg: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  play(e) {
    for (let i = 0; i < this.data.video_context_list.length; i++) {
      if (i !== e.currentTarget.dataset.index) {
        this.data.video_context_list[i].pause();
      }
    }
  },
  // 小程序列表
  minipro(complete) {
    app.ajax(app.my_config.api + 'minipro', null, (res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].pic) {
          res[i].pic = app.my_config.base_url + res[i].pic;
        } else {
          res[i].pic = app.my_config.default_img;
        }
      }

      this.setData({ minipro: res });
    }, null, () => {
      if (complete) {
        complete()
      }
    });
  },
  to_tiyan(e) {
    wx.navigateTo({ url: '../tiyan/tiyan' })
  },
  onShareAppMessage: function (e) {
    wx.showShareMenu({
      withShareTicket: true,
      success: function () {
      }
    });
  },
  // 轮播跳转
  jump(e) {
    let index = e.currentTarget.dataset.index;
    let image_list = this.data.swiper.image_list;
    if (image_list[index].url) {
      wx.navigateTo({ url: image_list[index].url });
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    if (!this.data.loading) {
      this.data.loading = true;
    }
    wx.showNavigationBarLoading();
    switch (this.data.tab) {
      case 1:
        this.homeSlide(() => {
          this.homeArticle(() => {
            this.caseList(() => {
              this.partnerList(() => {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                this.data.loading = false;
              });
            });
          });
        });
        break;
      case 2:
        this.homeSlide(() => {
          this.museumList(() => {
            this.star_relic(() => {
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
              this.data.loading = false;
            });
          });
        });
        break;
      case 3:
        this.homeSlide(() => {
          this.getLongImg(() => {
            this.getVideo(() => {
              this.minipro(() => {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                this.data.loading = false;
              });
            });
          });
        });
        break;
    }
  }
})