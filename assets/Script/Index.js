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

  init: function() {
    this._chick = this.Chick.getComponent("Chick");
    this.clearLabel = this.clearNode.getChildByName("Value").getComponent(cc.Label);
    this.clearBar = this.clearNode.getChildByName("heath_bar").getComponent(cc.ProgressBar);
    this.MenuModal = cc.find("/div_menu/Modal_more", this.node);
    this.btnMoreSprite = this.btnMoreNode.getComponent(cc.Sprite);
    this.handNode = cc.find("Hand", this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    // var chickState = new Chick();
    this.MenuListNode.active = false;
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
      this._chick.setId(data.ChickenList[0].ID);
      this._chick.initData();
    }
  },
  //点击治疗事件 弹出alert
  showTreatAlert: function() {
    var self = this;
    //调用接口
    Func.PostTreat(this._chick._Id)
      .then(data => {
        if (data.Code === 1) {
          var animState = self._chick._chickAnim.play("chick_treat");
          this._chick._chickStatus.sick = false;
          this._chick._chickAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
        } else if (data.Code == "000") {
          Msg.show(data.Message);
        } else if (data.Code === 3333) {
          Alert.show(data.Message, this.rechargeEvent, this.treatIcon, "剩余的牧场币不足");
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击清理事件 弹出alert
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
          this._chick._chickStatus.shit = false;
          this.handAnim.on("finished", () => {
            this.handNode.active = false;
          });
          this.handAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击喂食事件 弹出alert
  showFeedAlert: function() {
    var self = this;
    Func.PostOwnFeeds(this._chick._Id)
      .then(data => {
        if (data.Code === 1) {
          var anim = self._chick._chickAnim.play("chick_feed");
          anim.repeatCount = 4;
          this._chick._chickStatus.hungry = false;
          this._chick._chickAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
        } else if (data.Code == "000") {
          Msg.show(data.Message);
        } else if (data.Code === 333) {
          Alert.show(data.Message, this.loadSceneShop, this.feedIcon, "剩余的饲料不足");
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //将饲料放入饲料槽中
  putFeed() {
    let handFeedNode = cc.find("hand_feed", this.node);
    handFeedNode.active = true;
    let hanfFeedAnim = handFeedNode.getComponent(cc.Animation);
    hanfFeedAnim.play("hand_feed");
    hanfFeedAnim.on("finished", () => {
      handFeedNode.active = false;
    });
  },
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

  //点击充值 跳转场景
  rechargeEvent: function() {
    cc.director.loadScene("recharge");
  },

  //
  loadSceneShop() {
    cc.director.loadScene("shop");
  },

  showUserCenter: function() {
    cc.director.loadScene("userCenter");
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
