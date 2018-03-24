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
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;
var AlertshelfJs = require("AlertShelf");
var Alertshelf = AlertshelfJs.Alertshelf;

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
    btnRed_Prefab: {
      default: null,
      type: cc.Prefab
    },
    btnWhite_Prefab: {
      default: null,
      type: cc.Prefab
    },
    btnGray_Prefab: {
      default: null,
      type: cc.Prefab
    },

    chickNode: null
  },
  loadSceneIndex() {
    cc.director.loadScene("index");
  },
  //加载系统道具
  leftBtnEvent() {
    //样式切换
    this.leftLineNode.active = true;
    this.rightLineNode.active = false;
    this.leftLabelNode.color = cc.color("#FF4C4C");
    this.rightLabelNode.color = cc.color("#444444");

    this.GetSystemListByPage();
  },
  //加载流通物品
  rightBtnEvent() {
    //样式切换
    this.leftLineNode.active = false;
    this.rightLineNode.active = true;
    this.leftLabelNode.color = cc.color("#444444");
    this.rightLabelNode.color = cc.color("#FF4C4C");

    this.GetRepertoryList();
  },

  onLoad() {
    this.leftNode = cc.find("bg/tab/left", this.node);
    this.rightNode = cc.find("bg/tab/right", this.node);
    this.leftLineNode = cc.find("line", this.leftNode);
    this.rightLineNode = cc.find("line", this.rightNode);
    this.leftLabelNode = cc.find("label", this.leftNode);
    this.rightLabelNode = cc.find("label", this.rightNode);

    this.chickNode = cc.find("Chick", this.node);

    this.leftNode.on("click", this.leftBtnEvent, this);
    this.rightNode.on("click", this.rightBtnEvent, this);

    this.GetSystemListByPage();
  },
  //系统仓库数据
  GetSystemListByPage() {
    this.goodsListNode = cc.find("bg/bg-f3/PageView/view/content/page_1/goodsList", this.node);
    this.goodsListNode.removeAllChildren();
    Func.GetSystemListByPage().then(data => {
      let list = data.List;
      let chickItem;
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];
        if (goods.Type === 1) {
          chickItem = list.splice(i, 1);
        }
      }
      list.unshift(...chickItem);
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];

        let goodsNode = cc.instantiate(this.goods_Prefab);
        if (goods.Count > 0) {
          this.assignData(goods, goodsNode);
          this.goodsListNode.addChild(goodsNode);
        }
      }
      //Loading.hide();
      //新手指引
      if (Config.firstLogin) GuideSystem.guide();
    });
  },
  //流通物品
  GetRepertoryList() {
    this.goodsListNode = cc.find("bg/bg-f3/PageView/view/content/page_1/goodsList", this.node);
    this.goodsListNode.removeAllChildren();
    Func.GetRepertoryList().then(data => {
      let list = data.List;
      // var list = [{ Type: 1, Count: 1 }, { Type: 4, Count: 13 }];
      for (let i = 0; i < list.length; i++) {
        const goods = list[i];
        let goodsNode = cc.instantiate(this.goods_Prefab);

        if (goods.Count > 0) {
          this.assignData(goods, goodsNode);
          this.goodsListNode.addChild(goodsNode);
        }
      }
      //Loading.hide();
    });
  },
  //根据不同的type 加载不同的图片，文字，数量 绑定回调函数
  assignData(goods, goodsNode) {
    //获取组件
    let goodSprite = cc.find("img", goodsNode).getComponent(cc.Sprite);
    let countLabel = cc.find("icon-tip/count", goodsNode).getComponent(cc.Label);
    let nameLabel = cc.find("name", goodsNode).getComponent(cc.Label);
    //获取物品数据
    let type = goods.Type;
    let count = goods.Count;
    switch (type) {
      //1 代表可孵化的鸡蛋
      case 1:
        //加载图片
        cc.loader.loadRes("Modal/Repertory/img-hatchEgg", cc.SpriteFrame, function(err, spriteFrame) {
          goodSprite.spriteFrame = spriteFrame;
        });
        nameLabel.string = "鸡蛋(可孵化)";
        this.bindGoodsEvent(goodsNode, this.hatchEgg, "孵化");
        break;
      case 2:
        cc.loader.loadRes("Modal/Repertory/img-egg", cc.SpriteFrame, function(err, spriteFrame) {
          goodSprite.spriteFrame = spriteFrame;
        });
        var name = "鸡蛋";
        nameLabel.string = name;
        this.bindGoodsEvent(
          goodsNode,
          () => {
            this.shelfEvent(name, 2, goodsNode);
          },
          "上架",
          () => {
            this.exChange(name, 2);
          },
          "兑换",
          () => false,
          "下架"
        );
        break;

      case 3:
        cc.loader.loadRes("Modal/Repertory/img-hen", cc.SpriteFrame, function(err, spriteFrame) {
          goodSprite.spriteFrame = spriteFrame;
        });
        var name = "贵妃鸡";
        nameLabel.string = name;
        this.bindGoodsEvent(
          goodsNode,
          () => {
            this.shelfEvent(name, 1, goodsNode);
          },
          "上架",
          () => {
            this.exChange(name, 3);
          },
          "兑换",
          () => false,
          "下架"
        );
        break;
      case 4:
        cc.loader.loadRes("Modal/Repertory/feed", cc.SpriteFrame, function(err, spriteFrame) {
          goodSprite.spriteFrame = spriteFrame;
        });
        nameLabel.string = "饲料";
        this.bindGoodsEvent(goodsNode, this.feed, "添加饲料槽");
        break;
      case 5:
        cc.loader.loadRes("Modal/Repertory/feed", cc.SpriteFrame, function(err, spriteFrame) {
          goodSprite.spriteFrame = spriteFrame;
        });
        nameLabel.string = "成长剂";
        this.bindGoodsEvent(goodsNode, () => Msg.show("暂时还未开通该道具功能"), "使用");
        break;
    }
    countLabel.string = count;
  },
  // 绑定点击事件及回调函数(f1,f2,f3表示三个回调函数，name1，name2,name3表示按钮文字)
  bindGoodsEvent(goodsNode, f1, name1, f2, name2, f3, name3) {
    goodsNode.on(
      "click",
      event => {
        //绑定this到goodsNode上 （红、白、灰三个按钮的回调）
        this.goodsEvent.call(goodsNode, [f1, f2, f3], [name1, name2, name3]);
      },
      this
    );
    goodsNode.on(
      "maskClick",
      event => {
        //绑定this到goodsNode上 （红、白、灰三个按钮的回调）
        this.goodsEvent.call(goodsNode, [f1, f2, f3], [name1, name2, name3]);
      },
      this
    );
  },
  //点击商品事件 绑定模态框回调函数及图片、名字
  goodsEvent() {
    //回调函数
    let f1 = arguments[0][0];
    let f2 = arguments[0][1];
    let f3 = arguments[0][2];
    //按钮名称
    let name1 = arguments[1][0];
    let name2 = arguments[1][1];
    let name3 = arguments[1][2];
    //this 绑定在goodsNode（该物品上）
    let spriteFrame = cc.find("img", this).getComponent(cc.Sprite).spriteFrame;
    let name = cc.find("name", this).getComponent(cc.Label).string;
    //获得js的上下文
    let that = cc.find("Canvas").getComponent("Repertory");
    //获得组件
    let modalNode = cc.instantiate(that.modal_Perfab);
    let bgNode = cc.find("bg", modalNode);
    let imgNode = cc.find("div/img", modalNode);
    let imgSprite = imgNode.getComponent(cc.Sprite);
    let modalNameLabel = cc.find("div/name", modalNode).getComponent(cc.Label);
    let btnGroupNode = cc.find("div/btn-group", modalNode);
    //赋值 图片和道具名称
    imgSprite.spriteFrame = spriteFrame;
    modalNameLabel.string = name;
    //加入按钮
    if (f1) {
      let btnRedNode = cc.instantiate(that.btnRed_Prefab);
      let btnLabel = cc.find("label", btnRedNode).getComponent(cc.Label);
      btnLabel.string = name1;
      btnGroupNode.addChild(btnRedNode);
      btnRedNode.on("click", f1, that);
      btnRedNode.on("maskClick", f1, that);
    }
    if (f2) {
      let btnWhiteNode = cc.instantiate(that.btnWhite_Prefab);
      let btnLabel = cc.find("label", btnWhiteNode).getComponent(cc.Label);
      btnLabel.string = name2;
      btnGroupNode.addChild(btnWhiteNode);
      btnWhiteNode.on("click", f2, that);
    }
    // if (f3) {
    //   let btnGrayNode = cc.instantiate(that.btnGray_Prefab);
    //   let btnLabel = cc.find("label", btnGrayNode).getComponent(cc.Label);
    //   btnLabel.string = name3;
    //   btnGroupNode.addChild(btnGrayNode);
    //   btnGrayNode.on("click", f3, that);
    // }

    //fadeIn 进入动画
    modalNode.opacity = 0;
    modalNode.runAction(cc.fadeIn(0.3));
    //关闭模态框
    bgNode.on("click", () => {
      Tool.closeModal(modalNode);
    });
    that.node.addChild(modalNode);
  },
  //孵化小鸡回调
  hatchEgg() {
    cc.director.loadScene("index", () => {
      let sceneNode = cc.find("Canvas");
      let indexJs = sceneNode.getComponent("Index");
      indexJs.operate = 0;
    });
  },
  //添加饲料槽
  feed() {
    cc.director.loadScene("index", () => {
      let sceneNode = cc.find("Canvas");
      let indexJs = sceneNode.getComponent("Index");
      indexJs.operate = 1;
    });
  },
  //点击上架 弹出模态框
  shelfEvent(name, type, goodsNode) {
    Alertshelf.show(name, () => {
      this.OnShelf(type, goodsNode);
    });
  },
  //上架事件（点击确定的回调）
  OnShelf(type, goodsNode) {
    let countLabel = cc.find("icon-tip/count", goodsNode).getComponent(cc.Label);
    //获取输入框的价格及数量
    let unitprice = Alertshelf._price;
    let count = Alertshelf._count;
    Func.OnShelf(type, unitprice, count)
      .then(data => {
        if (data.Code === 1) {
          Msg.show(data.Message);
          if (data.Model > 0) {
            countLabel.string = data.Model;
          } else {
            goodsNode.removeFromParent();
          }
        } else {
          Msg.show(data.Message);
        }
      })
      .catch(data => {
        Msg.show(data.Message);
      });
  },
  //兑换事件
  exChange(name, type) {
    //放到Config.js做中转
    Config.exchangeData.actualName = name;
    Config.exchangeData.actualCount = 1;
    Config.exchangeData.virtualName = name;
    if (type == 2) {
      Config.exchangeData.virtualCount = 2;
    } else if (type == 3) {
      Config.exchangeData.virtualCount = 1;
    }
    Config.exchangeData.goodsType = type;
    cc.director.loadScene("exchange");
  },
  start() {}

  // update (dt) {},
});
