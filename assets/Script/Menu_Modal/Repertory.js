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
    btnCloseNode: {
      default: null,
      type: cc.Node
    },
    goods_Prefab: {
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
  goShop() {
    cc.director.loadScene("shop");
  },
  onLoad() {
    this.goodsListNode = cc.find("bg-repertory/scrollview/view/goodsList", this.node);
    Func.GetRepertoryList().then(data => {
      let list = data.List;
      // var list = [{ Type: 1, Count: 1 }, { Type: 4, Count: 13 }];
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];
        var goodsNode = cc.instantiate(this.goods_Prefab);
        var goodSprite = cc.find("img", goodsNode).getComponent(cc.Sprite);
        let countLabel = cc.find("count", goodsNode).getComponent(cc.Label);
        switch (goods.Type) {
          case 1:
            (function(goodSprite) {
              cc.loader.loadRes("Modal/Repertory/img-egg", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
            })(goodSprite);
            break;
          case 3:
            break;
          case 4:
            (function(goodSprite) {
              cc.loader.loadRes("Modal/Repertory/feed", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
            })(goodSprite);
            break;
        }
        countLabel.string = "x " + goods.Count;

        this.goodsListNode.addChild(goodsNode);
      }
    });
  },

  start() {}

  // update (dt) {},
});
