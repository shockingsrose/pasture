var AlertTemp = {};

AlertTemp.show = function(name, Prefab) {
  var self = this;
  Alert.show();
};
AlertTemp.close = function(alertName) {
  var self = this;
  console.log("close modal");
  var closeDom = cc.find("Canvas/" + alertName);
  var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(closeDom.removeFromParent));
  closeDom.runAction(action);
};
module.exports = {
  AlertTemp: AlertTemp
};
// var AlertTemp = cc.Class({
//   properties: {
//     AlertTemp_Prefab: {
//       default: null,
//       type: cc.Prefab
//     }
//   },

//   showModal: function() {
//     var self = this;
//     // AlertTemp.showModal(self.AlertTemp_Prefab);
//   },
//   closeModal: function() {
//     var self = this;
//     // AlertTemp.closeModal("AlertTemp");
//   },
//   start() {}

//   // update (dt) {},
// });
// module.exports = {
//   AlertTemp: AlertTemp
// };
