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
  goodsListNode: null,
  fillterListNode: null,
  onLoad() {
    var self = this;
    //商品类型 1全部  2我的商品 3鸡蛋 4 贵妃鸡
    self.fillterClickEvent();
  },
  start() {
    var self = this;
    self.getList(self.pageIndex, 9, window.Config.shopP2P);
  },
  //筛选按钮自定义模态弹框
  fillterClickEvent() {
    var self = this;
    self.fillterButton = cc.find("bg/mygoods", self.node);
    self.fillterButton.on("click", event => {
      Alert.show("0", null, null, null, null, null, "Prefab/Modal/Shop/filterGoods", function() {
        var selfAlert = this;
        cc.loader.loadRes(Alert._newPrefabUrl, cc.Prefab, function(error, prefab) {
          if (error) {
            cc.error(error);
            return;
          }
          // 实例
          var alert = cc.instantiate(prefab);
          Alert._alert = alert;
          //动画
          selfAlert.ready();
          Alert._alert.parent = cc.find("Canvas");
          selfAlert.startFadeIn();
          selfAlert.newButtonEvent(alert, "close");
          //绑定四个筛选按钮的筛选事件
          self.bindClickEvent(cc.find("alertBackground/scrollview/view/content/item1", alert));
          self.bindClickEvent(cc.find("alertBackground/scrollview/view/content/item2", alert));
          self.bindClickEvent(cc.find("alertBackground/scrollview/view/content/item3", alert));
          self.bindClickEvent(cc.find("alertBackground/scrollview/view/content/item4", alert));
        });
      });
    });
  },
  //筛选按钮事件绑定
  bindClickEvent(obj) {
    var self = this;
    obj.on("click", function() {
      window.Config.shopP2P = Number(obj._name.slice(4));
      cc.director.loadScene("shopP2P");
    });
  },

  fetchData(index, size, data) {
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
  },
  //切换数据接口
  getList(index, size, e) {
    var self = this;
    Func.GetGoodList(index, size).then(data => {
      self.fetchData(index, size, data);
    });
  },
  getNextPageList() {
    this.pageIndex++;
    if (this.hasMore) {
      this.getList(this.pageIndex, 9, window.Config.shopP2P);
    }
  },
  backEvent() {
    cc.director.loadScene("index");
  },
  gotoPage() {
    cc.director.loadScene("shop");
  }

  // update (dt) {},
});
