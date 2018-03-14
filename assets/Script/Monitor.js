// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
  extends: cc.Component,

  isHover: false,

  properties: {
    Video_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  // onLoad () {},

  start() {
    let self = this;
  },
  bindClickEvent() {
    Alert.show("0", null, null, null, null, null, "Prefab/Modal/Video", function() {
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
        var cancelButton = cc.find("box", alert);
        cancelButton.on("click", function() {
          alert.destroy();
          // var action = cc.sequence(cc.fadeOut(0.3),, cc.callFunc(, alert));
          // // alert.runAction(action);
          // var video = cc.find("New Node", alert);
          // video.removeFromParent;
        });
      });
    });
    // location = "http://birthday.zjytny.cn/video.html";
  },
  btnBackEvent() {
    cc.director.loadScene("index");
  }
  // update (dt) {},
});
