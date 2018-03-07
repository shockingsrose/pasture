var Data = require("Data");
var Func = Data.func;

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
    Func.GetSignList()
      .then(data => {
        if (data.Code === 1) {
          this.signList = data.List;
          this.renderCalendar();

          if (this.todayNode.getChildByName("item_do").active) {
            var signButton = cc.find("btn-sign", this.node.parent);
            cc.loader.loadRes("btn-hasSign", cc.SpriteFrame, function(err, spriteFrame) {
              signButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          }
        } else {
          Alert.show(data.Message);
        }
      })
      .catch(reason => {
        Alert.show(reason.Message);
      });
  },
  //渲染日历（）
  renderCalendar() {
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
    //几号
    var newCurrentDay = 1;

    for (var i = firstDay; i < currentDay + firstDay; i++) {
      var itemNode = this.node.getChildByName(`item${i}`);
      var dayNode = itemNode.getChildByName("item_undo").getChildByName("day"); //日期节点(item)
      if (newCurrentDay == newday) {
        dayNode.color = new cc.Color(65, 205, 225);
        this.todayNode = this.node.getChildByName(`item${i}`);
      }
      dayNode.getComponent(cc.Label).string = newCurrentDay++;

      for (let j = 0; j < this.signList.length; j++) {
        //是否签到
        const state = this.signList[j].IsSign;
        //如果签到了 设置为签到状态
        if (i == j + firstDay && state) {
          itemNode.getChildByName("item_do").active = true;
          itemNode.getChildByName("item_undo").active = false;
        }
      }

      //日期绑定签到事件
      itemNode.on("touchend", function(event) {
        console.log(event);
      });
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
    Func.PostSign().then(data => {
      if (data.Code === 1) {
        var signButton = cc.find("btn-sign", this.node.parent);
        cc.loader.loadRes("btn-hasSign", cc.SpriteFrame, function(err, spriteFrame) {
          signButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        Msg.show("签到成功! 积分增加" + data.Point + ",牧场币增加" + data.RachMoney, 0.3, 3000);
      }
    });
  }
});
