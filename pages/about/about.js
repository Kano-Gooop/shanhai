const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
const utils = require('../../utils/utils.js');

Page({
  data: {
    aboutUs: {},
		// 地图
		longitude: 117.088260,
		latitude: 39.100264,
		markers: [{
			iconPath: '/icons/location.png',
			id: 0,
			longitude: 117.088260,
			latitude: 39.100264,
			width: 50,
			height: 50
		}],
  },
  onLoad() {
    this.aboutUs();
  },
  onShow() {
    utils.select_tab_bar(this, 2);
  },
  aboutUs() {
    app.ajax(app.my_config.api + 'aboutUs', null, (res) => {
      this.setData({aboutUs: res});
      let rich_text = res.intro;
      rich_text = rich_text.replace(/\/ueditor\/php\/upload\//g, app.my_config.base_url.substr(0, app.my_config.base_url.length - 1) + '/ueditor/php/upload/');
      WxParse.wxParse('rich_text', 'html', rich_text, this);
    });
  },
	comeHere:function(e){
		// var endLatitude = e.currentTarget.dataset.latitude,
		// 	endLongitude = e.currentTarget.dataset.longitude,
		// 	endName = "山海文化有限公司"
		wx.navigateTo({
			// url: '../map/map?latitude=' + endLatitude + '&longitude=' + endLongitude + '&title=' + endName
			url: '../map/map'
		})
	}
})