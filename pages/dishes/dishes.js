var app = getApp()
var util = require('../../utils/util.js');
Page({
	data: {
		hidden:false,
		curNav:1,
		curIndex:0,
		cart:[],
		cartTotal:0,
    hide_good_box: true,
		navList:[
			{
				id:1,
				name:'热销菜品'
			},
			{
				id:2,
				name:'热菜'
			},
			{
				id:3,
				name:'凉菜'
			},
			{
				id:4,
				name:'套餐'
			}
		],
		dishesList:[
			[
				{
					name:"红烧肉",
					price:38,
					num:0,
					id:1
				},
				{
					name:"宫保鸡丁",
					price:58,
					num:0,
					id:29
				},
				{
					name:"水煮鱼",
					price:88,
					num:0,
					id:2
				}
			],
			[
				{
					name:"小炒日本豆腐",
					price:18,
					num:0,
					id:3
				},
				{
					name:"烤鱼",
					price:58,
					num:0,
					id:4
				}
			],
			[
				{
					name:"大拌菜",
					price:18,
					num:0,
					id:5
				},
				{
					name:"川北凉粉",
					price:8,
					num:0,
					id:6
				}
			],
			[]
		],
		dishes:[]
	},
	loadingChange () {
		setTimeout(() => {
			this.setData({
				hidden:true
			})
		},2000)
	},
	selectNav (event) {
		let id = event.target.dataset.id,
			index = parseInt(event.target.dataset.index);
			self = this;
		this.setData({
			curNav:id,
			curIndex:index
		})
	},
	onLoad () {
    this.busPos = {};
    this.busPos['x'] = app.globalData.ww -290;
    this.busPos['y'] = app.globalData.hh-30;
		this.loadingChange()
	},
  // 增加数量
  addCount(e) {
   // this.doCountMinus(e, 1) 
    //加入购物车动画
    this.touchOnGoods(e)
  },
  // 减少数量
  minusCount(e) {
    this.doCountMinus(e, -1) 
  },

  /*************************加入购物车动画开始****************************/
  touchOnGoods: function (e) {
     this.finger = {}; var topPoint = {};
    //点击的位置
    this.finger['x'] = e.touches["0"].clientX-20;
    this.finger['y'] = e.touches["0"].clientY-20;
     
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }

    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else {
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

     this.linePos = util.bezier([this.finger, topPoint, this.busPos], 30);
 
    console.log(this.busPos, this.topPoint, this.finger)
    this.linePos = util.bezier([this.busPos, topPoint, this.finger], 60);
    this.startAnimation();
  },
  startAnimation: function () {
    var index = 0, that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    index = bezier_points.length;
    this.timer = setInterval(function () {
      index--;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      // if (index >= 28) {
      if (index < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 33);
  },
/*************************加入购物车动画结束****************************/
})
