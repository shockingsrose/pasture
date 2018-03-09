var Data = require("Data");
var utils = require("utils");
cc.Class({
  extends: cc.Component,

  properties: {
    AddressList_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  defaultId: 0,
  btnBackEvent() {
    cc.director.loadScene(Config.backUrl);
  },
  btnGoAddressAdd() {
    cc.director.loadScene("AddressEdit");
  },
  getAddressList() {
    Data.func.getAddressList().then(data => {
      for (let i = 0; i < data.List.length; i++) {
        const PropertyList = cc.instantiate(this.AddressList_Prefab);
        const PrefabParent = cc.find("scrollview/view/layout/toggleGroup", this.node);
        let UserName = cc.find("toggle/New Node/label", PropertyList).getComponent(cc.Label);
        let Address = cc.find("toggle/New Node/label2", PropertyList).getComponent(cc.Label);
        let box = cc.find("toggle", PropertyList).getComponent(cc.Toggle);
        let checkButton = cc.find("toggle", PropertyList);
        let rightButton = cc.find("right", PropertyList);
        if (data.List[i].IsDefault) {
          self.defaultId = data.List[i].ID;
          box.isChecked = true;
        }
        box.toggleGroup = PrefabParent.getComponent(cc.ToggleGroup);
        UserName.string = data.List[i].username + "  " + data.List[i].telNumber;
        Address.string = data.List[i].addressDetailInfo;
        checkButton.on("click", function() {
          self.defaultId = data.List[i].ID;
        });
        rightButton.on("click", () => {
          Config.addressId = data.List[i].ID;
          cc.director.loadScene("AddressEdit");
        });
        PrefabParent.addChild(PropertyList);
      }
    });
  },
  setDefaultId() {
    Data.func.setDefaultAddress(self.defaultId).then(data => {
      Msg.show("地址设置成功");
      setTimeout(function() {
        cc.director.loadScene(Config.backUrl);
      }, 2000);
    });
  },
  onLoad() {
    this.getAddressList();
  },

  start() {},

  update(dt) {}
});
