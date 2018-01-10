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

    properties: {
       
    },

    showAlertText: function () {
        Alert.show("难道还有这种操作？");
    },

    showAlertCallBack: function () {
        Alert.show("难道还有这种操作？", function(){
            cc.log("确定按钮被点击！");
        });
    },

    showAlertOnlayEnter: function () {
        Alert.show("难道还有这种操作？", null, false);
    },

    showAlertAnimSpeed: function () {
        Alert.show("难道还有这种操作？", null, null, 0.1);
    },

    // update (dt) {},
});
