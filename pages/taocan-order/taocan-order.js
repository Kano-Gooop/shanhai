const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    full_loading: true,
    order_list: []
  },
  onLoad() {
    this.orderList(() => {
      this.setData({ full_loading: false });
    });
  },
  // 订单列表
  orderList(complete) {
    app.ajax(app.my_config.api + 'orderList', null, res => {
      app.format_time(res, 'pay_time', 'yyyy-MM-dd hh:mm:ss');
      this.setData({ order_list: res });
    }, null, () => {
      if (complete) {
        complete();
      }
    });
  }
});