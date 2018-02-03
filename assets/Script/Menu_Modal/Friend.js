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

  properties: {
    itemTop3: {
      default: null,
      type: cc.Prefab
    },
    itemFriend: {
      default: null,
      type: cc.Prefab
    },
    itemSearch: {
      default: null,
      type: cc.Prefab
    }
  },
  closeModal() {
    var self = this;
    console.log("close modal");
    var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this.node.removeFromParent, this.node));
    this.node.runAction(action);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },
  onLoad() {
    Func.GetFriendsList().then(data => {
      console.log(data);
      var friendList = data.List;
      for (let i = 0; i < friendList.length; i++) {
        const element = friendList[i];
        var item = cc.instantiate(this.itemTop3);
        this.node.addChild(item);
      }
    });
  },
  start() {}

  // update (dt) {},
});
