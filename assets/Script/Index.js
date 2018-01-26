//Chick.js

// 节点不带_   私有变量_
var Chick = require("Chick");

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
    // hpNode: {
    //   default: null,
    //   type: cc.Prefab
    // }
  },
  //Chick.js
  _chick: null,

  _clearValue: null,
  clearLabel: null,
  clearBar: null,
  //菜单 半透明背景 Modal_more
  MenuModal: null,
  btnMoreSprite: null,

  init: function() {
    this._chick = this.Chick.getComponent("Chick");
    this.clearLabel = this.clearNode.getChildByName("Value").getComponent(cc.Label);
    this.clearBar = this.clearNode.getChildByName("heath_bar").getComponent(cc.ProgressBar);
    this.MenuModal = cc.find("/div_menu/Modal_more", this.node);
    this.btnMoreSprite = this.btnMoreNode.getComponent(cc.Sprite);
    // var chickState = new Chick();
    this.MenuListNode.active = false;

    this._clearValue = 99;
    this.clearLabel.string = this._clearValue + "%";
    this.clearBar.progress = this._clearValue / 100;
  },
  //点击治疗事件 弹出alert
  showTreatAlert: function() {
    var self = this;
    Alert.show("此次治疗需要花费***元\n恢复**点成长值", this.treatIcon, function() {
      self._chick._chickAnim.play("chick_move");
      setTimeout(() => {
        self._chick._chickAnim.play("chick_move");
      }, 5000);
    });
  },
  //点击清理事件 弹出alert
  showClearAlert: function() {
    var self = this;
    if (this._chick._shitCount > 0) {
      Alert.show("此次清理需要花费***元\n恢复**点成长值", this.clearIcon, function() {
        //清洁值 _clearValue
        self._clearValue =
          self._clearValue + self._chick._shitCount >= 100 ? 100 : self._clearValue + self._chick._shitCount;
        self.clearLabel.string = self._clearValue + "%";
        self.clearBar.progress = self._clearValue / 100;

        self._chick._shitAnim.play("shit");
        self._chick._shitCount = 0;
        clearInterval(self._chick._timer);
        self._chick._timer = setInterval(() => {
          self._chick._shitCount++;
        }, 5000);
      });
    } else {
      Alert.show("暂时不需要清理", this.clearIcon);
    }
  },
  //点击喂食事件 弹出alert
  showFeedAlert: function() {
    var self = this;
    Alert.show("此次喂食需要花费***元\n恢复**点成长值", this.feedIcon, function() {
      self._chick._chickAnim.play("chick_feed");
      setTimeout(() => {
        self._chick._chickAnim.play("chick_move");
      }, 5000);

      //成长值 +1
      self._chick._hpValue += 1;
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
  showHP: function() {
    this._chick._hpNode.active = true;
    // this._chick._hpNode.runAction(cc.fadeIn(0.3));
    setTimeout(() => {
      this._chick._hpNode.active = false;
      // this._chick._hpNode.runAction(cc.fadeOut(0.3));
    }, 3000);
  },
  //点击充值 跳转场景
  rechargeEvent: function() {
    cc.director.loadScene("recharge");
  },
  onLoad: function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        var response = xhr.responseText;
        console.log(response);
      }
    };

    xhr.open("GET", "http://192.168.42.88:4633/T_Base_User/GetWholeData?openID=o9AgowGKcD5MAuYIhedEX-4aHpJc", true);
    xhr.setRequestHeader("Content-Type", "json");
    xhr.send();
  },
  start: function() {
    this.init();
  },

  update(dt) {}
});
