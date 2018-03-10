// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Data = require("Data");
var Func = Data.func;
cc.Class({
  extends: cc.Component,

  properties: {},
  ctor() {},
  btnBackEvent() {
    cc.director.loadScene("index");
  },
  bindNode() {
    this.moneyLabel = cc.find("bg/container/div/gold/money", this.node).getComponent(cc.Label);
  },
  initData() {
    Func.GetUserMoney().then(data => {
      if (data.Code === 1) {
        this.moneyLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  onLoad() {
    this.bindNode();
    this.initData();
  },

  start() {}

  // update (dt) {},
});
