const Data = require("Data");
const Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {
    target: {
      default: null,
      type: cc.Prefab
    },
    //商品
    goods_Prefab: {
      default: null,
      type: cc.Prefab
    },
    //可上下架商品
    goods2_Prefab: {
      default: null,
      type: cc.Prefab
    },
    pageIndex: 1,
    hasMore: true,
    goodsType: 1
  },
  goodsListNode: null,
  fillterListNode: null,
  onLoad() {
    let self = this;
    //商品类型 1全部  2我的商品 3鸡蛋 4 贵妃鸡
    self.fillterClickEvent();
    self.goodsType = window.Config.shopP2P;
    self.initfillterButton(self.goodsType);
    self.getList(self.pageIndex, 9, self.goodsType);
  },
  start() {
    let self = this;
  },
  //筛选按钮自定义模态弹框
  fillterClickEvent() {
    let self = this;
    self.fillterButton = cc.find("bg/mygoods", self.node);
    self.fillterButton.on("click", event => {
      Alert.show("0", null, null, null, null, null, "Prefab/Modal/Shop/filterGoods", function() {
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
    let self = this;
    obj.on("click", function() {
      window.Config.shopP2P = Number(obj._name.slice(4));
      cc.director.loadScene("shopP2P");
    });
  },

  //初始化筛选按钮
  initfillterButton(type) {
    let self = this;
    let buttonVal = cc.find("bg/mygoods/text", self.node).getComponent(cc.Label);
    switch (type) {
      case 1:
        buttonVal.string = "全部商品";
        break;
      case 2:
        buttonVal.string = "我的商品";
        break;
      case 3:
        buttonVal.string = "鸡蛋";
        break;
      case 4:
        buttonVal.string = "贵妃鸡";
        break;
    }
  },
  fetchData(index, size, data, type) {
    var self = this;
    if (data.List.length == 0) {
      return (self.hasMore = false);
    } else {
      const goodsList = data.List;
      let clone = cc.instantiate(self.target);
      clone._name = "page_" + index;
      let box = cc.find("bg/PageView/view/content", self.node);
      //获取pageView组件
      let boxTemp = cc.find("bg/PageView", self.node).getComponent(cc.PageView);
      //动态添加页面
      boxTemp.addPage(clone);
      let goodsListNode = cc.find("page_" + index + "/goodsList", box);
      for (let i = 0; i < goodsList.length; i++) {
        const goods = goodsList[i];
        let goodsNode, onSell, goodSprite, goodsLabel, priceLabel, count, clicknode;

        if (type == 2) {
          clicknode = cc.find("xia", goodsNode);
          onSell = cc.find("xia/text", goodsNode);
          onSell.getComponent(cc.Label).string = "下架";
          //绑定我的商品的 点击事件
          self.bindSellEvent(clicknode, goods.OffType, goods.ID);
        } else {
          //绑定其余的购买商品的点击事件
          goodsNode = self.bindGoodsEvent(type, goods);
        }
        goodSprite = cc.find("pic-box/pic", goodsNode).getComponent(cc.Sprite);
        goodsLabel = cc.find("price-box/goods_label", goodsNode).getComponent(cc.Label);
        priceLabel = cc.find("price-box/bg-price/price", goodsNode).getComponent(cc.Label);
        count = 1;
        //渲染商品列表
        switch (goods.Type) {
          case 1:
            cc.loader.loadRes("Shop/guifeiji", cc.SpriteFrame, function(err, spriteFrame) {
              goodSprite.spriteFrame = spriteFrame;
            });
            goodsLabel.string = "贵妃鸡" + "x" + goods.NowCount;
            break;
          case 2:
            cc.loader.loadRes("Shop/icon-egg", cc.SpriteFrame, function(err, spriteFrame) {
              goodSprite.spriteFrame = spriteFrame;
            });
            goodsLabel.string = "鸡蛋" + "x" + goods.NowCount;
            break;
        }

        priceLabel.string = goods.NowALLRanchMoney;
        goodsListNode.addChild(goodsNode);
      }
      self.getNextPageList(type);
    }
  },
  //下架
  bindSellEvent(obj, e, playerid) {
    obj.on("click", event => {
      Func.OffShelf(playerid).then(data => {
        if (data.Code === 1) {
          Msg.show("下架成功");
          setTimeout(function() {
            cc.director.loadScene("shopP2P");
          }, 1000);
        } else {
          Msg.show(data.Message);
        }
      });
    });
  },
  // //上架
  // bindOnSellEvent(obj, type, unitprice, count) {
  //   obj.on("click", event => {
  //     Alert.show("是否上架该商品？", function() {
  //       Func.OnShlf(type, unitprice, count).then(data => {
  //         if (data.Code === 1) {
  //           Msg.show("上架成功");
  //         } else {
  //           Msg.show(data.Message);
  //         }
  //       });
  //     });
  //   });
  // },
  //商品事件绑定
  bindGoodsEvent(type, data) {
    var self = this;
    let goods;
    //选择预置资源类型
    if (type == 2) {
      goods = cc.instantiate(this.goods2_Prefab);
    } else {
      goods = cc.instantiate(this.goods_Prefab);
      goods.on("click", event => {
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
            selfAlert.newButtonEvent(alert, "bg/btn-group/cancelButton");
            self.P2PBuyData(alert, data);
          });
        });
      });
    }
    return goods;
  },
  //切换数据接口
  getList(index, size, e) {
    let self = this;
    if (e == 1) {
      Func.GetSellList(0, index, size).then(data => {
        self.fetchData(index, size, data, e);
      });
    } else if (e == 2) {
      Func.GetShelvesList(index, size).then(data => {
        self.fetchData(index, size, data, e);
      });
    } else if (e == 3) {
      Func.GetSellList(2, index, size).then(data => {
        self.fetchData(index, size, data, e);
      });
    } else if (e == 4) {
      Func.GetSellList(1, index, size).then(data => {
        self.fetchData(index, size, data, e);
      });
    }
  },
  //购买商品模态框
  P2PBuyData(obj, data) {
    //初始总价
    let sumMoney = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let editBox = cc.find("bg/input", obj);
    let value = cc.find("bg/money/value", obj);
    let confirm = cc.find("bg/btn-group/enterButton", obj);
    let valueComp = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let count = 1;
    valueComp.string = data.NowALLRanchMoney;
    //绑定input变化事件
    editBox.on("text-changed", () => {
      count = Number(editBox.getComponent(cc.EditBox).string);
      valueComp.string = data.NowALLRanchMoney * count;
    });
    //商品购买事件
    confirm.on("click", () => {
      if (count > data.NowCount) {
        Msg.show("您输入的数量不能大于" + data.NowCount);
        return;
      }
      Func.PostBuyP2P(data.ID, count).then(data => {
        if (data.Code === 1) {
          Msg.show("购买成功");
          setTimeout(function() {
            cc.director.loadScene("shopP2P");
          }, 1000);
        } else {
          Msg.show(data.Message);
        }
      });
    });
  },
  //查看是否还有下一页数据并加载
  getNextPageList(type) {
    this.pageIndex++;
    if (this.hasMore) {
      this.getList(this.pageIndex, 9, type);
    }
  },
  //返回
  backEvent() {
    cc.director.loadScene("index");
  },
  //切换系统商城
  gotoPage() {
    cc.director.loadScene("shop");
  }

  // update (dt) {},
});
