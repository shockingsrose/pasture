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
    },
    sceneNode: null,
    chickNode: null
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
    this.sceneNode = cc.find("Canvas");
    this.chickNode = cc.find("Chick", this.sceneNode);
    this.goodsListNode = cc.find("bg-repertory/scrollview/view/goodsList", this.node);
    Func.GetRepertoryList().then(data => {
      let list = data.List;
      // var list = [{ Type: 1, Count: 1 }, { Type: 4, Count: 13 }];
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];
        let goodsNode = cc.instantiate(this.goods_Prefab);
        let goodSprite = cc.find("img", goodsNode).getComponent(cc.Sprite);
        let countLabel = cc.find("count", goodsNode).getComponent(cc.Label);
        let modalNode = cc.find("img/modal", goodsNode);
        let hatchButton = cc.find("btn-hatch", modalNode);
        let cancelButton = cc.find("btn-cancel", modalNode);

        if (goods.Count > 0) {
          switch (goods.Type) {
            //1 代表可孵化的鸡蛋
            case 1:
              //加载图片
              cc.loader.loadRes("Modal/Repertory/img-hatchEgg", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              //绑定弹出Modal
              goodsNode.on("click", event => {
                modalNode.active = true;
                modalNode.opacity = 0;
                modalNode.runAction(cc.fadeIn(0.3));
              });
              //绑定孵化、取消事件
              hatchButton.on("click", event => {
                Func.HatchEgg().then(data => {
                  if (data.Code === 1) {
                    this.chickNode.active = true;
                    this.closeModal();
                  } else {
                    Alert.show(data.Message);
                  }
                });
              });
              cancelButton.on("click", event => {
                var action = cc.sequence(
                  cc.fadeOut(0.3),
                  cc.callFunc(() => {
                    modalNode.active = false;
                  })
                );
                modalNode.runAction(action);
              });
              break;
            case 3:
              break;
            case 4:
              cc.loader.loadRes("Modal/Repertory/feed", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              break;
          }

          countLabel.string = "x " + goods.Count;

          this.goodsListNode.addChild(goodsNode);
        }
      }
    });
  },

  start() {}

  // update (dt) {},
});
