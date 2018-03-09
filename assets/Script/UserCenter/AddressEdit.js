var Data = require("Data");
var utils = require("utils");
cc.Class({
  extends: cc.Component,
  id: null,
  username: null,
  tel: null,
  info: null,
  pro: null,
  btnBackEvent() {
    cc.director.loadScene("AddressList");
  },

  updataAddress() {
    let self = this;

    Data.func
      .updateAddress(self.id, self.username.string, self.tel.string, self.pro.string, self.info.string)
      .then(data => {
        cc.director.loadScene("AddressList");
      });
  },
  onLoad() {},

  start() {
    var self = this;
    self.id = Config.addressId;
    self.username = cc.find("scrollview/view/layout/list/address1/right/editbox", self.node).getComponent(cc.EditBox); //姓名
    self.tel = cc.find("scrollview/view/layout/list/address2/right/editbox", self.node).getComponent(cc.EditBox); //电话
    self.info = cc.find("scrollview/view/layout/list/address3/right/editbox", self.node).getComponent(cc.EditBox); //地址
    self.pro = cc.find("scrollview/view/layout/list/address4/right/editbox", self.node).getComponent(cc.EditBox); //邮编
    Data.func.getAddressList().then(data => {
      for (let i = 0; i < data.List.length; i++) {
        if (data.List[i].ID == self.id) {
          self.username.string = data.List[i].username;
          self.tel.string = data.List[i].telNumber;
          self.info.string = data.List[i].addressDetailInfo;
          self.pro.string = data.List[i].addressPostalCode;
        }
      }
    });
  }

  // update (dt) {},
});
