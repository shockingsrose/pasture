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
    goods_Prefab: {
      default: null,
      type: cc.Prefab
    },
    modal_Perfab: {
      default: null,
      type: cc.Prefab
    },
    sceneNode: null,
    chickNode: null
  },
  loadSceneIndex() {
    cc.director.loadScene("index");
  },
  goShop() {
    cc.director.loadScene("shop");
  },
  onLoad() {
    this.sceneNode = cc.find("Canvas");
    this.chickNode = cc.find("Chick", this.sceneNode);
    this.goodsListNode = cc.find("bg/bg-f3/PageView/view/content/page_1/goodsList", this.node);
    Func.GetRepertoryList().then(data => {
      let list = data.List;
      // var list = [{ Type: 1, Count: 1 }, { Type: 4, Count: 13 }];
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];
        let goodsNode = cc.instantiate(this.goods_Prefab);
        let goodSprite = cc.find("img", goodsNode).getComponent(cc.Sprite);
        let countLabel = cc.find("icon-tip/count", goodsNode).getComponent(cc.Label);
        let nameLabel = cc.find("name", goodsNode).getComponent(cc.Label);
        let modalNode = cc.find("img/modal", goodsNode);
        let hatchButton = cc.find("btn-hatch", modalNode);
        let cancelButton = cc.find("btn-cancel", modalNode);
        let type = goods.Type;
        let pos = goodsNode.getNodeToWorldTransform();

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
                    this.chickNode.setPosition(0, -140);
                    var chickJs = this.chickNode.getComponent("Chick");
                    chickJs.setId(data.Model);

                    this.closeModal();
                    chickJs._chickAnim.play("chick_born");
                    chickJs._chickAnim.on("finished", chickJs.chickFunc.initData, chickJs);
                  } else {
                    Msg.show(data.Message);
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

              nameLabel.string = "鸡蛋(可孵化)";
              break;
            case 2:
              cc.loader.loadRes("Modal/Repertory/img-egg", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              nameLabel.string = "鸡蛋";
              break;

            case 3:
              cc.loader.loadRes("Modal/Repertory/img-hen", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              nameLabel.string = "贵妃鸡";
              break;
            case 4:
              cc.loader.loadRes("Modal/Repertory/feed", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              nameLabel.string = "饲料";
              break;
          }

          countLabel.string = goods.Count;

          goodsNode.on("click", event => {
            let modalNode = cc.instantiate(this.modal_Perfab);
            let bgNode = cc.find("bg", modalNode);
            let imgNode = cc.find("div/img", modalNode);
            let imgSprite = imgNode.getComponent(cc.Sprite);
            let modalNameLabel = cc.find("div/name", modalNode).getComponent(cc.Label);
            //赋值 图片和道具名称
            imgSprite.spriteFrame = goodSprite.spriteFrame;
            modalNameLabel.string = nameLabel.string;
            //fadeIn 进入动画
            modalNode.opacity = 0;
            modalNode.runAction(cc.fadeIn(0.3));
            //关闭模态框
            bgNode.on("click", () => {
              Tool.closeModal(modalNode);
            });
            this.sceneNode.addChild(modalNode);
          });

          this.goodsListNode.addChild(goodsNode);
        }
      }
      //Loading.hide();
    });
  },

  start() {}

  // update (dt) {},
});
