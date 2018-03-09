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

  properties: {},
  _actualName: null,
  _actualCount: null,
  _virtualName: null,
  _virtualCount: null,
  _goodsType: null,
  _userName: null,
  _phone: null,
  _address: null,

  ctor() {
    //从config文件中初始化
    this._actualName = Config.exchangeData.actualName;
    this._actualCount = Config.exchangeData.actualCount;
    this._virtualName = Config.exchangeData.virtualName;
    this._virtualCount = Config.exchangeData.virtualCount;
    this._goodsType = Config.exchangeData.goodsType;
  },

  bindNode() {
    this.infoNameLabel = cc.find("bg/info/layout/name", this.node).getComponent(cc.Label);
    this.infoPhoneLabel = cc.find("bg/info/layout/phone", this.node).getComponent(cc.Label);
    this.addressLabel = cc.find("bg/info/address", this.node).getComponent(cc.Label);
    this.actualNameLabel = cc.find("bg/actual/name", this.node).getComponent(cc.Label);
    this.minusButton = cc.find("bg/actual/layout/btn-minus", this.node);
    this.addButton = cc.find("bg/actual/layout/btn-add", this.node);
    this.actualCountLabel = cc.find("bg/actual/layout/rect-border/count", this.node).getComponent(cc.Label);
    this.virtualNameLabel = cc.find("bg/virtual/name", this.node).getComponent(cc.Label);
    this.virtualCountLabel = cc.find("bg/virtual/count", this.node).getComponent(cc.Label);
    this.exchangeButton = cc.find("enterButton", this.node);
    this.rightButton = cc.find("bg/info/btn-right", this.node);
  },
  initData() {
    this.actualNameLabel.string = this._actualName;
    this.actualCountLabel.string = this._actualCount;
    this.virtualNameLabel.string = this._virtualName;
    this.virtualCountLabel.string = this._virtualCount;
    //收货信息
    Func.getAddressList().then(data => {
      if (data.Code === 1) {
        let list = data.List;
        let info = list.forEach(element => {
          if (element.IsDefault) {
            this._userName = element.username;
            this._phone = element.telNumber;
            this._address =
              element.proviceFirstStageName +
              element.addressCitySecondStageName +
              element.addressCountiesThirdStageName +
              element.addressDetailInfo;
          }
        });

        this.infoNameLabel.string = this._userName;
        this.infoPhoneLabel.string = this._phone;
        this.addressLabel.string = this._address;
      } else Msg.show(data.Message);
    });
  },
  bindEvent() {
    //减号按钮事件
    this.minusButton.on("click", () => {
      this._actualCount = this._actualCount - 1 < 0 ? 0 : this._actualCount - 1;
      Func.GetExchangeCount(this._goodsType, this._actualCount).then(data => {
        this._virtualCount = data.Model;
        this.actualCountLabel.string = this._actualCount;
        this.virtualCountLabel.string = this._virtualCount;
      });
    });
    //加号按钮事件
    this.addButton.on("click", () => {
      this._actualCount++;
      Func.GetExchangeCount(this._goodsType, this._actualCount).then(data => {
        this._virtualCount = data.Model;
        this.actualCountLabel.string = this._actualCount;
        this.virtualCountLabel.string = this._virtualCount;
      });
    });
    //兑换事件
    this.exchangeButton.on("click", () => {
      switch (this._goodsType) {
        case 2: //鸡蛋
          Func.ExchangeEgg(this._userName, this._address, this._phone, this._actualCount).then(data => {
            if (data.Code === 1) {
              Msg.show(data.Message);
            } else {
              Msg.show(data.Message);
            }
          });
          break;
        case 3: //贵妃鸡
          Func.ExchangeChicken(this._userName, this._address, this._phone, this._actualCount).then(data => {
            if (data.Code === 1) {
              Msg.show(data.Message);
            } else {
              Msg.show(data.Message);
            }
          });
          break;
      }
    });
    //跳转到地址列表事件
    this.rightButton.on("click", () => {
      this.loadAddressListScene();
    });
  },
  loadAddressListScene() {
    Config.backUrl = "exchange";
    cc.director.loadScene("UserCenter/AddressList");
  },
  loadRepertory() {
    cc.director.loadScene("repertory");
  },
  onLoad() {
    this.bindNode();
  },
  start() {
    this.initData();
    this.bindEvent();
  }
});
