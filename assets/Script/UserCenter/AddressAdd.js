var Data = require("Data");
var utils = require("utils");
cc.Class({
  extends: cc.Component,
  btnBackEvent() {
    cc.director.loadScene("AddressList");
  },

  addAddress() {
    let self = this;
    let name = cc.find("scrollview/view/layout/list/address1/right/editbox", self.node).getComponent(cc.EditBox); //姓名
    let tel = cc.find("scrollview/view/layout/list/address2/right/editbox", self.node).getComponent(cc.EditBox); //电话
    let info = cc.find("scrollview/view/layout/list/address3/right/editbox", self.node).getComponent(cc.EditBox); //地址
    let pro = cc.find("scrollview/view/layout/list/address4/right/editbox", self.node).getComponent(cc.EditBox); //邮编
    Data.func.addAddress(name.string, tel.string, pro.string, info.string).then(data => {
      if (data.Code == 0) {
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
        setTimeout(function() {
          cc.director.loadScene("AddressList");
        }, 2000);
      }
    });
  },
  onLoad() {
    var self = this;
  },

  start() {}

  // update (dt) {},
});
