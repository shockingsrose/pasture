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
    this.chickFunc = this._chick.chickFunc;
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

    //签到设置
  },
  //点击治疗事件 弹出alert
  showTreatAlert: function() {
    var self = this;
    // Alert.show("暂时不需要治疗", this.treatIcon, function() {
    if (this._chick._chickStatus.sick) {
      var animState = self._chick._chickAnim.play("chick_treat");
      this._chick._chickStatus.sick = false;
      this._chick._chickAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
    } else {
      Alert.show("暂时不需要治疗");
    }
  },
  //点击清理事件 弹出alert
  showClearAlert: function() {
    var self = this;
    if (this._chick._chickStatus.shit) {
      //牧场肮脏 执行动画
      this.handNode.active = true;
      this.handAnim.play("hand_clear");
      this._chick._chickStatus.shit = false;
      this.handAnim.on("finished", () => {
        this.handNode.active = false;
      });
      this.handAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
    } else {
      //牧场不脏 弹出提示框
      Alert.show("暂不需要清洁");
    }
  },
  //点击喂食事件 弹出alert
  showFeedAlert: function() {
    var self = this;
    if (this._chick._chickStatus.hungry) {
      var anim = self._chick._chickAnim.play("chick_feed");
      anim.repeatCount = 2;
      this._chick._chickStatus.hungry = false;
      this._chick._chickAnim.on("finished", this.chickFunc.playChickAnim, this._chick);
    } else {
      Alert.show("暂不需要喂食");
    }

    //成长值 +1
    self._chick._hpValue += 1;
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
  showHP: function() {
    this._chick._hpNode.active = true;
    var hpBar = cc.find("hpBar", this._chick._hpNode);
    //取消级联透明度的设置  不会继承父级opacity（不设置会导致Mask失效）
    hpBar.cascadeOpacity = false;

    this._chick._hpNode.opacity = 0;
    this._chick._hpNode.runAction(cc.fadeIn(0.3));
    var action = cc.sequence(
      cc.fadeOut(0.3),
      cc.callFunc(() => {
        this._chick._hpNode.active = false;
      }, this)
    );
    setTimeout(() => {
      this._chick._hpNode.runAction(action);
    }, 1000);
  },
  //点击充值 跳转场景
  rechargeEvent: function() {
    cc.director.loadScene("recharge");
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
    this.init();

    Func.GetWholeData().then(data => {
      console.log(data);
      this.initData(JSON.parse(data));
    });
  },
  start: function() {},

  update(dt) {}
});
