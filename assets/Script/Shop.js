var Data = require("Data");
var Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {
    goods_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  goodsListNode: null,

  onLoad() {
    this.goodsListNode = cc.find("bg/PageView/view/content/page_1/goodsList", this.node);

    Func.GetGoodList().then(data => {
      const goodsList = data.List;
      for (let i = 0; i < goodsList.length; i++) {
        const goods = goodsList[i];
        if (!goods.IsDelete) {
          let goodsNode = cc.instantiate(this.goods_Prefab);
          // goodsNode.name = goods.PropName;
          let goodSprite = cc.find("pic-box/pic", goodsNode).getComponent(cc.Sprite);
          let goodsLabel = cc.find("price-box/goods_label", goodsNode).getComponent(cc.Label);
          let priceLabel = cc.find("price-box/bg-price/price", goodsNode).getComponent(cc.Label);
          switch (goods.PropName) {
            case "鸡蛋":
              // (function(goodSprite) {
              //   cc.loader.loadRes("Shop/icon-egg", cc.SpriteFrame, function(err, spriteFrame) {
              //     goodSprite.spriteFrame = spriteFrame;
              //   });
              // })(goodSprite);
              cc.loader.loadRes("Shop/icon-egg", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });
              break;
            case "饲料":
              cc.loader.loadRes("Shop/icon-1", cc.SpriteFrame, function(err, spriteFrame) {
                goodSprite.spriteFrame = spriteFrame;
              });

              break;
          }
          goodsLabel.string = goods.PropName;
          priceLabel.string = goods.PropValue;

          this.goodsListNode.addChild(goodsNode);

          goodsNode.on("click", event => {
            Alert.show("是否确认购买该商品？", function() {
              Func.PostBuy(goods.ID).then(data => {
                if (data.Code === 1) {
                  Msg.show("购买成功");
                } else {
                  Msg.show(data.Message);
                }
              });
            });
          });
        }
      }
    });
  },
  backEvent() {
    cc.director.loadScene("index");
  },
  start() {}

  // update (dt) {},
});
