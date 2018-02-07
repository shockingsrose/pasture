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
      var goodsList = data.List;
      for (let i = 0; i < goodsList.length; i++) {
        const goods = goodsList[i];
        if (!goods.IsDelete) {
          let goodsNode = cc.instantiate(this.goods_Prefab);
          // goodsNode.name = goods.PropName;
          var goodSprite = cc.find("pic-box/pic", goodsNode).getComponent(cc.Sprite);
          var goodsLabel = cc.find("price-box/goods_label", goodsNode).getComponent(cc.Label);
          var priceLabel = cc.find("price-box/bg-price/price", goodsNode).getComponent(cc.Label);
          switch (goods.PropName) {
            case "鸡蛋":
              (function(goodSprite) {
                cc.loader.loadRes("Shop/icon-egg", cc.SpriteFrame, function(err, spriteFrame) {
                  goodSprite.spriteFrame = spriteFrame;
                });
              })(goodSprite);
              break;
            case "饲料":
              (function(goodSprite) {
                cc.loader.loadRes("Shop/icon-1", cc.SpriteFrame, function(err, spriteFrame) {
                  goodSprite.spriteFrame = spriteFrame;
                });
              })(goodSprite);

              break;
          }
          goodsLabel.string = goods.PropName;
          priceLabel.string = goods.PropValue;

          this.goodsListNode.addChild(goodsNode);

          goodsNode.on("click", event => {
            console.log(this);

            Alert.show("是否确认购买该商品？", function() {
              Func.PostBuy(goods.ID).then(data => {
                if (data.Code === 1) {
                } else {
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
