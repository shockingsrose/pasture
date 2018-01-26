cc.Class({
  extends: cc.Component,

  properties: {
    parentNode: {
      default: null,
      type: cc.Node
    }
  },

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

    // this.node
    //   .getChildByName("data")
    //   .getChildByName(`year`)
    //   .getComponent(cc.Label).string =
    //   newyear + " 年";
    // this.node
    //   .getChildByName("data")
    //   .getChildByName(`month`)
    //   .getComponent(cc.Label).string =
    //   newmonth + 1 + " 月";

    var lastDay = this.getMonthsDay(newyear, lastMonth);
    var newlastDay = lastDay;
    // for (var i = firstDay - 1; i >= 0; i--) {
    //   this.node.getChildByName("title1").getChildByName(`item${i}`).color = new cc.Color(192, 192, 192);
    //   this.node
    //     .getChildByName("title1")
    //     .getChildByName(`item${i}`)
    //     .getComponent(cc.Label).string = newlastDay--;
    // }

    console.log(
      `lastMonth:${lastMonth} newmonth:${newmonth} firstDay:${firstDay} currentDay:${currentDay} lastDay:${lastDay}`
    );

    var newCurrentDay = 1;
    for (var i = firstDay; i <= 6; i++) {
      if (newCurrentDay == newday) {
        this.node.getChildByName("title1").getChildByName(`item${i}`).color = new cc.Color(65, 205, 225);
      }
      this.node
        .getChildByName("title1")
        .getChildByName(`item${i}`)
        .getComponent(cc.Label).string = newCurrentDay++;
    }

    var num = 1;
    var number = 0;
    for (var i = newCurrentDay; i <= currentDay; i++) {
      if ((i - newCurrentDay) % 7 === 0) {
        num++;
        number = 0;
      }

      if (i == newday) {
        this.node.getChildByName(`title${num}`).getChildByName(`item${number}`).color = new cc.Color(65, 205, 225);
      }
      this.node
        .getChildByName(`title${num}`)
        .getChildByName(`item${number++}`)
        .getComponent(cc.Label).string = i;
    }

    // if (number <= 6) {
    //   var index = 1;
    //   for (var i = number; i <= 6; i++) {
    //     this.node.getChildByName(`title${num}`).getChildByName(`item${number}`).color = new cc.Color(192, 192, 192);
    //     this.node
    //       .getChildByName(`title${num}`)
    //       .getChildByName(`item${number++}`)
    //       .getComponent(cc.Label).string = index++;
    //   }
    // }
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

  closeModal() {
    var self = this;
    console.log("close modal");
    //删除 爷爷节点
    var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(self.parentNode.removeFromParent, self.parentNode));
    self.parentNode.runAction(action);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  }
});
