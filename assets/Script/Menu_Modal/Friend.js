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
    },
    iconBtn01: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn02: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn03: {
      default: null,
      type: cc.SpriteFrame
    },
    inputNode: null
  },
  closeModal() {
    var self = this;
    console.log("close modal");
    var action = cc.sequence(
      cc.fadeOut(0.3),
      cc.callFunc(() => {
        this.node.active = false;
      }, this.node)
    );
    this.node.runAction(action);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },
  onLoad() {
    this.inputNode = cc.find("bg-repertory/form/input", this.node).getComponent(cc.EditBox);
    //得到好友列表数据 并调用绑定方法
    Func.GetFriendsList().then(data => {
      var friendList = data.List;
      this.bindData(friendList);
    });
  },
  start() {},

  // update (dt) {},

  //绑定数据（好友列表）
  bindData(friendList) {
    var contentNode = cc.find("bg-repertory/friendList/view/content", this.node);
    for (let i = 0; i < friendList.length; i++) {
      const element = friendList[i];
      var advisor = element.path;
      var name = element.RealName;
      var grade = element.Grade;
      //排名（字段不确定）
      var rank = element.Row || i;

      if (rank <= 3) {
        //Top3
        var item = cc.instantiate(this.itemTop3);
        var rankNode = cc.find("item-content/icon-no2", item);
        switch (rank) {
          case 1:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn01;
            break;
          case 2:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn02;
            break;
          case 3:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn03;
            break;
        }
      } else {
        //大于3 的排名
        var item = cc.instantiate(this.itemFriend);
        var rankLabel = cc.find("item-content/rank/text", item).getComponent(cc.Label);
        rankLabel.string = rank;
      }

      var advisorSprite = cc.find("item-content/advisor-box/adviosr-mask/advisor", item).getComponent(cc.Sprite);
      var nameLabel = cc.find("item-content/advisor-box/name", item).getComponent(cc.Label);
      var gradeLabel = cc.find("item-content/level-box/textbox/label", item).getComponent(cc.Label);

      nameLabel.string = name;
      gradeLabel.string = "Lv." + grade;

      contentNode.addChild(item);
    }
  },
  //搜索功能(搜索好友)
  search() {
    //输入框的值
    var str = this.inputNode.string;
  }
});
