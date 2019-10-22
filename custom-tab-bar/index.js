Component({
  data: {
    selected: 0,
    color: "#555",
    selectedColor: "#ff4544",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/icons/home.png",
      selectedIconPath: "/icons/home-active.png",
      text: "首页"
    }, {
      pagePath: "/pages/news/news",
      iconPath: "/icons/news.png",
      selectedIconPath: "/icons/news-active.png",
      text: "资讯"
    }, {
      pagePath: "/pages/about/about",
      iconPath: "/icons/about.png",
      selectedIconPath: "/icons/about-active.png",
      text: "关于我们"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    }
  }
})