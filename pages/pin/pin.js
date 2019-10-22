const app = getApp();

Page({
  data: {
    status: 0,  // 0.未开始 1.倒计时 2.拼图中 3.倒计时结束
    start_text: '开始游戏',
    start_count: 3,
    pin_count: 60,
    count_seed: 0,  // 倒计时种子
    pin_list: [
      {
        image: '/pin_images/pin1.jpg',
        order: 1
      },
      {
        image: '/pin_images/pin2.jpg',
        order: 2
      },
      {
        image: '/pin_images/pin3.jpg',
        order: 3
      },
      {
        image: '/pin_images/pin4.jpg',
        order: 4
      },
      {
        image: '/pin_images/pin5.jpg',
        order: 5
      },
      {
        image: '/pin_images/pin6.jpg',
        order: 6
      },
      {
        image: '/pin_images/pin7.jpg',
        order: 7
      },
      {
        image: '/pin_images/pin8.jpg',
        order: 8
      },
      {
        image: '/pin_images/pin9.jpg',
        order: 9
      }
    ],
    choose_index: -1
  },
  onLoad() {
  },
  onUnload() {
    clearInterval(this.data.count_seed);
  },
  start() {
    this.setData({status: 1});

    this.data.count_seed = setInterval(() => {
      if (this.data.start_count !== 1) {
        this.setData({start_count: this.data.start_count - 1})
      } else {
        clearInterval(this.data.count_seed);
        this.setData({status: 2});

        // 打乱拼图
        this.disorganize();

        this.data.count_seed = setInterval(() => {
          if (this.data.pin_count >= 0) {
            this.setData({pin_count: Number(this.data.pin_count - 0.01).toFixed(2)})
          } else {
            clearInterval(this.data.count_seed);
            app.modal('很遗憾，您没有完成拼图');
            this.setData({
              status: 3,
              start_count: 3,
              pin_count: 60,
              choose_index: -1,
              start_text: '重新开始'
            });
          }
        }, 10);
      }
    }, 1000);
  },
  // 拼图方法
  pin(e) {
    if (this.data.status === 2) {
      let index = e.currentTarget.dataset.index;
      let choose_index = this.data.choose_index;

      if (choose_index === -1) {
        this.setData({ choose_index: index });
      } else if (choose_index === index) {
        this.setData({ choose_index: -1 });
      } else {
        this.setData({
          ['pin_list[' + index + '].order']: this.data.pin_list[choose_index].order,
          ['pin_list[' + choose_index + '].order']: this.data.pin_list[index].order,
          choose_index: -1
        }, () => {
          if (this.is_complete()) {
            app.modal('恭喜您已完成拼图');
            clearInterval(this.data.count_seed);
            this.setData({
              start_text: '重新开始',
              status: 3,
              start_count: 3,
              pin_count: 60
            });
          }
        });
      }
    }
  },
  // 随机打乱拼图
  disorganize() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    arr.sort((a, b) => {
      return Math.random()>.5 ? -1 : 1;
    });

    let pin_list = this.data.pin_list;
    for (let i = 0; i < pin_list.length; i++) {
      pin_list[i].order = arr[i];
    }

    this.setData({ pin_list: pin_list });
  },
  // 计算拼图是否拼好
  is_complete() {
    let pin_list = this.data.pin_list;
    let order_text = '';
    for (let i = 0; i < pin_list.length; i++) {
      order_text += pin_list[i].order + ',';
    }
    order_text = order_text.slice(0, -1);
    
    return order_text === '1,2,3,4,5,6,7,8,9';
  }
});