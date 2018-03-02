var Data = require("Data");
var Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {
    target: {
      default: null,
      type: cc.Prefab
    },
    goods_Prefab: {
      default: null,
      type: cc.Prefab
    },
    pageIndex: 1,
    hasMore: true
  },

  onLoad() {
    var self = this;
  },
  getList(index, size) {
    Func.GetGoodList(index, size).then(data => {
      if (data.List.length == 0) {
        return (this.hasMore = false);
      } else {
        const goodsList = data.List;
        let clone = cc.instantiate(this.target);
        clone._name = "page_" + index;
        let box = cc.find("bg/PageView/view/content", this.node);
        //获取pageView组件
        let boxTemp = cc.find("bg/PageView", this.node).getComponent(cc.PageView);
        //动态添加页面
        boxTemp.addPage(clone);
        let goodsListNode = cc.find("page_" + index + "/goodsList", box);

        for (let i = 0; i < goodsList.length; i++) {
          const goods = goodsList[i];
          if (!goods.IsDelete) {
            let goodsNode = cc.instantiate(this.goods_Prefab);
            // goodsNode.name = goods.PropName;
            let goodSprite = cc.find("pic-box/pic", goodsNode).getComponent(cc.Sprite);
            let goodsLabel = cc.find("price-box/goods_label", goodsNode).getComponent(cc.Label);
            let priceLabel = cc.find("price-box/bg-price/price", goodsNode).getComponent(cc.Label);
            let count = 1;
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
                count = 10;
                break;
            }
            goodsLabel.string = goods.PropName + "x" + count;
            priceLabel.string = goods.PropValue * count;
            goodsListNode.addChild(goodsNode);
            goodsNode.on("click", event => {
              Alert.show("是否确认购买该商品？", function() {
                Func.PostBuy(goods.ID, count).then(data => {
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
        this.getNextPageList();
      }
    });
  },
  getNextPageList() {
    this.pageIndex++;
    if (this.hasMore) {
      this.getList(this.pageIndex, 9);
    }
  },
  backEvent() {
    cc.director.preloadScene("index", function() {
      cc.director.loadScene("index");
    });
  },
  gotoPage() {
    cc.director.loadScene("shopP2P");
  },
  start() {
    var self = this;
    self.getList(self.pageIndex, 9);
  }

  // update (dt) {},
});
