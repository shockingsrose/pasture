//Chick.js

// 节点不带_   私有变量_
var Chick = require("Chick");
var Data = require("Data");
var Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {
    //Chick 节点 Node
    Chick: {
      default: null,
      type: cc.Node
    },
    clearNode: {
      default: null,
      type: cc.Node
    },
    treatIcon: cc.SpriteFrame,
    clearIcon: cc.SpriteFrame,
    feedIcon: cc.SpriteFrame,
    //菜单栏 节点 Node MenuList
    MenuListNode: {
      default: null,
      type: cc.Node
    },
    btnMoreNode: {
      default: null,
      type: cc.Node
    }
  },
  //Chick.js
  _chick: null,

  _clearValue: null,
  clearLabel: null,
  clearBar: null,
  //菜单 半透明背景 Modal_more
  MenuModal: null,
  btnMoreSprite: null,
  chickFunc: null,
  //清理和喂食动画的节点
  handNode: null,
  handAnim: null,
  _signState: null,
  //点击显示小鸡状态的timer
  timer: null,
  //点击显示饲料槽的timer
  timer2: null,
  feedStateNode: null,
  wether: null,
  arrowNode: null,
  eggNode: null,

  init: function() {
    this._chick = this.Chick.getComponent("Chick");
    this.clearLabel = this.clearNode.getChildByName("Value").getComponent(cc.Label);
    this.clearBar = this.clearNode.getChildByName("heath_bar").getComponent(cc.ProgressBar);
    this.MenuModal = cc.find("/div_menu/Modal_more", this.node);
    this.btnMoreSprite = this.btnMoreNode.getComponent(cc.Sprite);
    this.handNode = cc.find("Hand", this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.arrowNode = this.node.getChildByName("icon-arrow");
    this.eggNode = this.node.getChildByName("egg");
    //天气
    this.wether = this.node.getChildByName("div_wether");
    //饲料数量
    this.feedCountLabel = cc.find("div_action/feed/icon-tip/count", this.node).getComponent(cc.Label);
    // var chickState = new Chick();
    this.MenuListNode.active = false;
    this.updateWether();
  },
  initData(data) {
    //清洁度设置
    this._clearValue = data.RanchModel.RanchCleanliness;
    this.clearLabel.string = this._clearValue + "%";
    this.clearBar.progress = this._clearValue / 100;

    //金币设置
    var RanchMoney = data.UserModel.RanchMoney;
    var moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    moneyLabel.string = RanchMoney;

    //初始化鸡是否显示
    this.Chick.active = data.ChickenList.length > 0 ? true : false;
    //调用setId接口 给鸡传Id 默认第一只鸡
    if (this.Chick.active) {
      this.Chick.setPosition(0, -140);
      this._chick.setId(data.ChickenList[0].ID);
      this._chick.initData();
    } else {
      Msg.show("您的牧场暂无小鸡");
    }

    //初始化饲料tip的数量
    this.feedCountLabel.string = data.UserModel.Allfeed == null ? 0 : data.UserModel.Allfeed;

    //初始化鸡蛋
    this.eggNode.active = data.RanchModel.EggCount > 0 ? true : false;
  },
  //收取鸡蛋
  collectEgg() {
    Func.CollectEgg().then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggNode.active = false;
          }, this)
        );
        this.eggNode.runAction(action);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //收取贵妃鸡
  collectChick() {
    Func.CollectChick(this._chick._Id).then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.Chick.active = false;
          }, this)
        );
        this.Chick.runAction(action);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //点击治疗事件
  showTreatAlert: function() {
    var self = this;
    //调用接口
    Func.PostTreat(this._chick._Id)
      .then(data => {
        if (data.Code === 1) {
          var animState = self._chick._chickAnim.play("chick_treat");

          this._chick._chickAnim.on("finished", this.chickFunc.initData, this._chick);
        } else if (data.Code == "000") {
          Alert.show(data.Message, this.rechargeEvent, this.treatIcon, "剩余的牧场币不足");
        } else if (data.Code === 333) {
          Msg.show(data.Message);
        } else if (data.Code == 444) {
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击清理事件
  showClearAlert: function() {
    var self = this;
    //调用接口
    Func.PostClean()
      .then(data => {
        if (data.Code === 1) {
          //清洁成功 牧场清洁度=100%
          this.clearLabel.string = 100 + "%";
          this.clearBar.progress = 1;
          //清洁动画
          this.handNode.active = true;
          this.handAnim.play("hand_clear");

          this.handAnim.on("finished", () => {
            this.handNode.active = false;
          });
          this.handAnim.on("finished", this.chickFunc.initData, this._chick);
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击喂食事件
  showFeedAlert: function() {
    var self = this;
    Func.PostOwnFeeds(this._chick._Id).then(data => {
      if (data.Code === 1) {
        this.updateFeedCount();
        var anim = self._chick._chickAnim.play("chick_feed");
        anim.repeatCount = 4;

        this._chick._chickAnim.on("finished", this.chickFunc.initData, this._chick);
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, this.feedIcon, "剩余的饲料不足");
      } else if (data.Code === 333) {
        //饥饿度是满的
        Msg.show(data.Message);
      } else if (data.Code === 444) {
        //鸡死了
        Msg.show(data.Message);
      }
    });
    // .catch(reason => {
    //   Msg.show("failed:" + reason);
    // });
  },
  //将饲料放入饲料槽中
  putFeed() {
    Func.AddFeed().then(data => {
      if (data.Code === 1) {
        let array = data.Model.split(",");
        let value = array[0];
        let capacity = array[1];
        this.assignFeedState(value, capacity);
        this.updateFeedCount();
        //动画
        let handFeedNode = cc.find("hand_feed", this.node);
        handFeedNode.active = true;
        let hanfFeedAnim = handFeedNode.getComponent(cc.Animation);
        hanfFeedAnim.play("hand_feed");
        hanfFeedAnim.on("finished", () => {
          handFeedNode.active = false;
        });
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, this.feedIcon, "剩余的饲料不足");
      } else if (data.Code == "333") {
        Msg.show(data.Message);
      }
    });
  },
  //显示饲料槽状态
  showFeedState() {
    if (this._chick._stateNode != null) this._chick._stateNode.active = false;

    Func.GetFeedData().then(data => {
      if (data.Code == 1) {
        this.arrowNode.active = false;
        let capacity = data.Model.FeedTroughCapacity;
        let value = data.Model.FeedCount;
        this.assignFeedState(value, capacity);

        //显示节点（动画）
        clearTimeout(this.timer2);
        this.feedStateNode.active = true;
        this.feedStateNode.opacity = 0;
        this.feedStateNode.runAction(cc.fadeIn(0.3));
        var action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.feedStateNode.active = false;
            this.arrowNode.active = true;
          }, this)
        );
        this.timer2 = setTimeout(() => {
          this.feedStateNode.runAction(action);
        }, 3000);
      } else {
        Alert.show(data.Message);
      }
    });
  },
  //赋值 饲料槽
  assignFeedState(value, capacity) {
    this.feedStateNode = this.node.getChildByName("feedState");
    let feedProgressBar = cc.find("layout/Bar", this.feedStateNode).getComponent(cc.ProgressBar);
    let feedBar = feedProgressBar.node.getChildByName("bar");
    let feedLabel = cc.find("layout/value", this.feedStateNode).getComponent(cc.Label);

    feedLabel.string = value + "/ " + capacity;
    feedProgressBar.progress = value / capacity;
    Tool.setBarColor(feedBar, value / capacity);
  },
  //更新 饲料tip的数量
  updateFeedCount() {
    Func.GetFeedCount().then(data => {
      if (data.Code === 1) {
        this.feedCountLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //更新天气情况
  updateWether() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find("soiltem", this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find("div/date", this.wether).getComponent(cc.Label);
      let wetherIcon = cc.find("div/icon", this.wether).getComponent(cc.Sprite);
      let bgNode = cc.find("bg", this.node);
      let rainNode = cc.find("ParticleRain", this.node);

      let time = res.data.weatherdata[0].intime.split(" ");
      let date = time[0].split("-");
      wetherItem1.string = res.data.weatherdata[0].soiltem + "℃";
      wetherItem2.string = date[1] + "月" + date[2] + "日";
      //根据天气情况 判断牧场的背景
      if (res.data.weatherdata[0].rain > 0) {
        //下雨
        cc.loader.loadRes("weather/bg-rain", cc.SpriteFrame, function(err, spriteFrame) {
          bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("weather/rain", cc.SpriteFrame, function(err, spriteFrame) {
          wetherIcon.spriteFrame = spriteFrame;
        });
        rainNode.active = true;
      } else if (res.data.weatherdata[0].light < 30000) {
        //阴天
        cc.loader.loadRes("weather/bg-cloud", cc.SpriteFrame, function(err, spriteFrame) {
          bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("weather/overcast", cc.SpriteFrame, function(err, spriteFrame) {
          wetherIcon.spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      } else {
        cc.loader.loadRes("weather/bg", cc.SpriteFrame, function(err, spriteFrame) {
          bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("weather/sun", cc.SpriteFrame, function(err, spriteFrame) {
          wetherIcon.spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      }
    });
  },
  //显示菜单栏 动画
  showMenu: function() {
    var self = this;

    if (!this.MenuListNode.active) {
      //弹出
      cc.loader.loadRes("btn-retract", cc.SpriteFrame, function(err, spriteFrame) {
        self.btnMoreSprite.spriteFrame = spriteFrame;
      });
      var fadeIn = cc.fadeIn(0.3);
      this.MenuModal.runAction(fadeIn);
      this.MenuListNode.active = !this.MenuListNode.active;
      var action = cc.moveTo(0.3, cc.p(0, -50));

      this.MenuListNode.runAction(action);
    } else {
      //收回
      cc.loader.loadRes("btn-more", cc.SpriteFrame, function(err, spriteFrame) {
        self.btnMoreSprite.spriteFrame = spriteFrame;
      });

      var action = cc.sequence(
        cc.moveTo(0.3, cc.p(0, -800)),
        cc.callFunc(() => {
          this.MenuListNode.active = !this.MenuListNode.active;
        }, this)
      );
      this.MenuListNode.runAction(action);

      //菜单栏 半透明背景
      this.MenuModal.runAction(cc.fadeOut(0.3));
    }
  },
  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene("weatherInfo");
  },
  //点击充值 跳转场景
  rechargeEvent: function() {
    cc.director.loadScene("recharge");
  },
  //
  loadSceneShop() {
    cc.director.loadScene("shop");
  },
  loadSceneMonitor() {
    cc.director.loadScene("monitor");
  },
  showUserCenter: function() {
    cc.director.loadScene("userCenter");
  },
  loadSceneRepertory() {
    cc.director.loadScene("repertory");
  },

  showSickAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.hungry = false;
    this._chick._chickStatus.shit = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showSickHungryAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showShitSickAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.hungry = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showShitHungryAnim: function() {
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.sick = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showHungrySickShitAnim: function() {
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.sick = true;
    this.chickFunc.playChickAnim.call(this._chick);
  },

  onLoad: function() {
    var openID = window.location.href.split("=")[1];
    Func.openID = openID || "dedbc83d62104d6da8d4a3c0188dc419";
  },

  start: function() {
    this.init();
    this.chickFunc = this._chick.chickFunc;
    Func.GetWholeData().then(data => {
      // console.log(data);
      if (data.Code === 1) {
        this.initData(data);
        // Loading.hide();
      } else {
        console.log("首页数据加载失败");
      }
    });
  },

  update(dt) {}
});
