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
    hasLoad: 1,
    pageCount: 9,
    WholeCount: 0
  },

  onLoad() {
    var self = this;
    self.getInitIndicator(0, 9);
  },
  getList(index, size) {
    self = this;
    Func.GetGoodList(index + 1, size).then(data => {
      self.dataFetch(index, size, data);
    });
  },
  //数据渲染
  dataFetch(index, size, data) {
    var self = this;
    const goodsList = data.List;
    let box = cc.find("bg/PageView/view/content", this.node);
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
        self.selectIcon(goods.PropName, goodSprite);
        cc.find("pic-box/pic", goodsNode).getComponent(cc.Widget).bottom = 0;
        goodsLabel.string = goods.PropName + "x" + count;
        priceLabel.string = goods.PropValue * count;
        goodsListNode.addChild(goodsNode);
        goodsNode.on("click", event => {
          Alert.show("0", null, null, null, null, null, "Prefab/Sell", function() {
            let selfAlert = this;
            cc.loader.loadRes(Alert._newPrefabUrl, cc.Prefab, function(error, prefab) {
              if (error) {
                cc.error(error);
                return;
              }
              // 实例
              let alert = cc.instantiate(prefab);
              Alert._alert = alert;
              //动画
              selfAlert.ready();
              Alert._alert.parent = cc.find("Canvas");
              selfAlert.startFadeIn();
              // 关闭按钮
              selfAlert.newButtonEvent(alert, "bg/btn-group/cancelButton");
              self.P2PBuyData(alert, goods);
            });
          });
        });
      }
    }
  },
  selectIcon(name, goodSprite, isSystemShop) {
    let iconSrc, iconSrc2;
    switch (name) {
      case "鸡蛋":
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";

        break;
      case "2级牧场":
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case "3级牧场":
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case "1级饲料槽":
        iconSrc = "Shop/icon-5";
        iconSrc2 = "Shop/icon-5";
        break;
      case "2级饲料槽":
        iconSrc = "Shop/icon-11";
        iconSrc2 = "Shop/icon-11";
        break;
      case "3级饲料槽":
        iconSrc = "Shop/icon-11";
        iconSrc2 = "Shop/icon-11";
        break;
      case "初级成长剂":
        iconSrc = "Shop/icon-8";
        iconSrc2 = "Shop/icon-8_";
        break;
      case "中级成长剂":
        iconSrc = "Shop/icon-9";
        iconSrc2 = "Shop/icon-9_";
        break;
      case "高级成长剂":
        iconSrc = "Shop/icon-10";
        iconSrc2 = "Shop/icon-10_";
        break;
      case "饲料":
        iconSrc = "Shop/icon-1";
        iconSrc2 = "Shop/icon-1_";
        break;
    }
    if (isSystemShop) {
      cc.loader.loadRes(iconSrc2, cc.SpriteFrame, function(err, spriteFrame) {
        goodSprite.spriteFrame = spriteFrame;
      });
    } else {
      cc.loader.loadRes(iconSrc, cc.SpriteFrame, function(err, spriteFrame) {
        goodSprite.spriteFrame = spriteFrame;
      });
    }
  },
  //购买商品模态框数据绑定
  P2PBuyData(obj, data) {
    var self = this;
    //初始总价
    let sumMoney = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let editBox = cc.find("bg/input", obj);
    let value = cc.find("bg/money/value", obj);
    let confirm = cc.find("bg/btn-group/enterButton", obj);
    let valueComp = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let icon = cc.find("guifeiji", obj).getComponent(cc.Sprite);
    let title = cc.find("bg/name", obj).getComponent(cc.Label);
    let goodSprite = cc.find("guifeiji", obj).getComponent(cc.Sprite);
    let count = 1;
    self.selectIcon(data.PropName, goodSprite, 1);
    title.string = data.PropName;
    valueComp.string = data.PropValue;
    //绑定input变化事件
    editBox.on("text-changed", () => {
      count = Number(editBox.getComponent(cc.EditBox).string);
      valueComp.string = data.PropValue * count;
    });
    //商品购买事件
    confirm.on("click", () => {
      Func.PostBuy(data.ID, count).then(data => {
        if (data.Code === 1) {
          Msg.show("购买成功");
          setTimeout(function() {
            cc.director.loadScene("shop");
          }, 1000);
        } else {
          Msg.show(data.Message);
        }
      });
    });
  },
  //初始化轮播导航
  getInitIndicator(index, size) {
    var self = this;
    Func.GetGoodList(index + 1, size).then(data => {
      self.WholeCount = data.RecordCount;
      let box = cc.find("bg/PageView/view/content", this.node);
      let boxTemp = cc.find("bg/PageView", this.node).getComponent(cc.PageView); //获取pageView组件
      for (let i = 0; i < Math.ceil(self.WholeCount / self.pageCount); i++) {
        let clone = cc.instantiate(this.target);
        clone._name = "page_" + i;

        boxTemp.addPage(clone); //动态添加页面
      }
      self.dataFetch(index, size, data);
      boxTemp.node.on("page-turning", function() {
        let goodsListNode = cc.find("page_" + boxTemp.getCurrentPageIndex(), box);
        let indexNum = boxTemp.getCurrentPageIndex();
        let diff = indexNum - self.hasLoad;
        if (diff == 0) {
          self.hasLoad++;
          self.getList(indexNum, 9);
        }
      });
    });
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
  }

  // update (dt) {},
});
