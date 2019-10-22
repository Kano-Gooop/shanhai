let plugin = requirePlugin("myPlugin")
let routeInfo = {
  endLat: 39.100264,
  endLng: 117.088260,
  endName: '山海文化有限公司',
  mode: 'car'
}
// var endLatitude, endLongitude, endName;

Page({
  data: {
    flag: 0,
    routeInfo: routeInfo
  },
  onLoad: function(options) {
    // endLatitude = options.latitude;
    // endLongitude = options.longitude;
    // endName = options.title;
    let the = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"] == undefined) {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              wx.chooseLocation({
                success: function(res) {
                  routeInfo.startLat = res.latitude;
                  routeInfo.startLng = res.longitude;
                  routeInfo.startName = res.address;
                  console.log(routeInfo)
                  the.setData({
                    routeInfo: routeInfo,
                    flag: 1
                  })
                },
              })
            },
          });
        } else if (res.authSetting["scope.userLocation"]) {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              wx.chooseLocation({
                success: function(res) {
                  routeInfo.startLat = res.latitude;
                  routeInfo.startLng = res.longitude;
                  routeInfo.startName = res.address;
                  console.log(routeInfo)
                  the.setData({
                    routeInfo: routeInfo,
                    flag: 1
                  })
                },
              })
            },
          });
        } else {
          the.setData({
            flag: 2
          })
        }
      }
    });
  },
  userLocation: function() {
    let the = this;
    wx.openSetting({
      success: function(res) {
        wx.redirectTo({
          url: '../map/map',
        })
      },
      fail: function() {
        the.setData({
          flag: 2
        })
      }
    })
  }
})