cc.Class({
  extends: cc.Component,

  properties: {
    parentNode: {
      default: null,
      type: cc.Node
    }
  },
  todayNode: null, //item 节点
  // use this for initialization
  onLoad: function() {
    var date = new Date();
    var newyear = date.getFullYear();
    var newmonth = date.getMonth();
    var newday = date.getDate();

    // 获取这月有多少天
    var currentDay = this.getMonthsDay(newyear, newmonth);
    // 获取当月第一天星期几
    var firstDay = this.getMonthFirst(newyear, newmonth);
    var lastMonth = newmonth - 1 >= 0 ? newmonth - 1 : 12;
    var lastDay = this.getMonthsDay(newyear, lastMonth);
    var newlastDay = lastDay;
    var newCurrentDay = 1;
    // 第一行赋值
    for (var i = firstDay; i <= 6; i++) {
      //第一行
      var itemNode = this.node
        .getChildByName("title1")
        .getChildByName(`item${i}`)
        .getChildByName("item_undo")
        .getChildByName("day"); //日期节点(item) 第一行
      if (newCurrentDay == newday) {
        itemNode.color = new cc.Color(65, 205, 225);
        this.todayNode = this.node.getChildByName("title1").getChildByName(`item${i}`);
      }
      itemNode.getComponent(cc.Label).string = newCurrentDay++;
      //日期绑定签到事件
      itemNode.on("touchend", function(event) {
        console.log(event);
      });
    }
    // 第二、三、四行赋值
    var num = 1;
    var number = 0;
    for (var i = newCurrentDay; i <= currentDay; i++) {
      if ((i - newCurrentDay) % 7 === 0) {
        num++;
        number = 0;
      }

      var itemNode = this.node
        .getChildByName(`title${num}`)
        .getChildByName(`item${number}`)
        .getChildByName("item_undo")
        .getChildByName("day"); //日期节点(item) 第2、3、4 行
      if (i == newday) {
        itemNode.color = new cc.Color(65, 205, 225);
        this.todayNode = this.node.getChildByName(`title${num}`).getChildByName(`item${number}`);
      }
      itemNode.getComponent(cc.Label).string = i;
      //日期绑定签到事件
      itemNode.on("touchend", function(event) {
        console.log(event);
      });
      number++;
    }
  },

  // 获取那年那月有多少天
  getMonthsDay(year, month) {
    var year = year;
    var month = month;
    if (arguments.length == 0) {
      var date = new Date();
      year = date.getFullYear();
      month = data.getMonth();
    }

    if (arguments.length == 1) {
      var date = new Date();
      month = data.getMonth();
    }

    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      monthDays[1] = 29;
    }
    return monthDays[month];
  },

  // 获取这个月第一天星期几
  getMonthFirst(year, month) {
    var year = year;
    var month = month;
    if (arguments.length == 0) {
      var date = new Date();
      year = date.getFullYear();
      month = data.getMonth();
    }

    if (arguments.length == 1) {
      var date = new Date();
      month = data.getMonth();
    }

    var newDate = new Date(year, month, 1);
    return newDate.getDay();
  },

  // 关闭模态框
  closeModal() {
    var self = this;
    console.log("close modal");
    //删除 爷爷节点
    var action = cc.fadeOut(0.3);
    self.parentNode.runAction(action);
    setTimeout(() => {
      self.parentNode.active = false;
    }, 400);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },

  signIn() {
    this.todayNode.getChildByName("item_do").active = true;
    this.todayNode.getChildByName("item_undo").active = false;
  }
});
