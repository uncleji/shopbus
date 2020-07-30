var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    hidden: false,
    curNav: 1,
    curIndex: 0,
    cart: [],
    cartTotal: 0,
    hide_good_box: true,
    navList: [{
        id: 1,
        name: '热销菜品'
      },
      {
        id: 2,
        name: '热菜'
      },
      {
        id: 3,
        name: '凉菜'
      },
      {
        id: 4,
        name: '套餐'
      }
    ],
    dishesList: [
      [{
          name: "红烧肉",
          price: 38,
          num: 0,
          id: 1
        },
        {
          name: "宫保鸡丁",
          price: 58,
          num: 0,
          id: 29
        },
        {
          name: "水煮鱼",
          price: 88,
          num: 0,
          id: 2
        }
      ],
      [{
          name: "小炒日本豆腐",
          price: 18,
          num: 0,
          id: 3
        },
        {
          name: "烤鱼",
          price: 58,
          num: 0,
          id: 4
        }
      ],
      [{
          name: "大拌菜",
          price: 18,
          num: 0,
          id: 5
        },
        {
          name: "川北凉粉",
          price: 8,
          num: 0,
          id: 6
        }
      ],
      []
    ],
    dishes: [],
    lock: true
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },
  selectNav(event) {
    let id = event.target.dataset.id,
      index = parseInt(event.target.dataset.index);
    self = this;
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  onLoad() {
    this.busPos = {};
    wx.createSelectorQuery().select('.bus').boundingClientRect(rect => {
      this.busPos['x'] = rect.left;
      this.busPos['y'] = rect.top;
    }).exec()
    this.loadingChange()
  },
  // 节流函数 防止重复点击
  throttle(obj, fn, gapTime) { 
    let _lastTime = null
    return (() => {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime) {
        fn(obj.e, obj.num || '')
        _lastTime = _nowTime
      }
    })()

    // let _nowTime = new Date().getTime()
    // if (_nowTime - this._lastTime > gapTime || !this._lastTime) {
    //   console.log(123)
    //   fn(obj.e, obj.num || '')
    //   this._lastTime = _nowTime
    // }
    // this.$apply()
  },

  // 增加数量
  addCount(e) {
    // if (this.data.lock) {
    //   this.setData({
    //     lock: false
    //   })
    //   setTimeout(() => {
    //     this.setData({
    //       lock: true
    //     })
    //   }, 500)
    //   this.doCountMinus(e, 1)
    //   this.touchOnGoods(e)
    // } 
    let obj = {
      e: e,
      num: 1
    }
    let fn = (e, num) => {
      this.doCountMinus(e, num)
      this.touchOnGoods(e)
    }
    this.throttle(obj, fn, 300)

    // this.doCountMinus(e, 1)
    // this.touchOnGoods(e)
    //加入购物车动画

  },
  // 减少数量
  minusCount(e) {
    let obj = {
      e: e,
      num: -1
    }
    let fn = (e, num) => {
      this.doCountMinus(e, num)
      // this.touchOnGoods(e)
    }
    this.throttle(obj, fn, 300)
    // this.throttle(this.touchOnGoods(e), 500)
    // this.throttle(this.doCountMinus(e, -1), 500)
  },
  //加减操作方法
  doCountMinus(e, plus) {
    var that = this
    let index = e.currentTarget.dataset.dish;
    let dishes = this.data.dishesList;
    console.log(dishes)
    for (let dish of dishes) {
      dish.forEach((item) => {
        if (item.id == index) {
          if (plus == 1) {
            item.num += 1;
          } else if (plus == -1) {
            if (item.num <= 0) {
              return false;
            }
            item.num -= 1;
          }
        }
      })
    }
    that.setData({
      dishesList: dishes
    });
    console.log(that.data.dishesList)
    that.getTotalPrice();
  },
  //计算总价
  getTotalPrice() {
    let dishes = this.data.dishesList; // 获取购物车列表
    let total = 0;
    for (let dish of dishes) {
      dish.forEach((item) => {
        if (item.num > 0) {
          total += item.num * item.price; // 所有价格加起来
        }
      })
    }
    this.setData({ // 最后赋值到data中渲染到页面
      cartTotal: total.toFixed(2)
    });
  },
  /*************************加入购物车动画开始****************************/
  touchOnGoods: function(e) {
    this.finger = {};
    var topPoint = {};
    //点击的位置
    this.finger['x'] = e.touches["0"].clientX - 20;
    this.finger['y'] = e.touches["0"].clientY - 20;
   // console.log(this.finger)
    topPoint['x'] = this.busPos['x']
// topPoint['x'] = 220
    topPoint['y'] =(this.finger['y']-16)/2+16
   
    console.log(topPoint)
    // if (this.finger['y'] < this.busPos['y']) {
    //   topPoint['y'] = this.finger['y'] - 150;
    // } else {
    //   topPoint['y'] = this.busPos['y'] - 150;
    // }

    // if (this.finger['x'] > this.busPos['x']) {
    //   topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    // } else {
    //   topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    // }


    // topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

    //  this.linePos = util.bezier([this.finger, topPoint, this.busPos], 30);
    console.log("缉拿",this.busPos, topPoint, this.finger)
    this.linePos = util.bezier([this.busPos, topPoint, this.finger], 30);
    console.log( "强强强强",this.linePos)
    this.startAnimation();
  },
  startAnimation: function() {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'] || '',
      bus_y: that.finger['y'] || ''
    })
    index = bezier_points.length;
  //  console.log(bezier_points, this.data.hide_good_box, )
    let timer = setInterval(function() {
      index--;
      that.setData({
        bus_x: bezier_points[index] ? bezier_points[index]['x'] : '',
        bus_y: bezier_points[index] ? bezier_points[index]['y'] : ''
      })

      // if (index >= 28) {
      if (index < 1) {
        clearInterval(timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 16);
  },
  /*************************加入购物车动画结束****************************/
})