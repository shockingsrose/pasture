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
       treatIcon: cc.SpriteFrame,
       clearIcon: cc.SpriteFrame,
       feedIcon: cc.SpriteFrame,
    },
    _chick: null,
    _chickAnim: null,
    

    init: function(){
        this._chick = this.node.getChildByName("chick01");
        this._chickAnim = this._chick.getComponent(cc.Animation);

        this._chickAnim.play('chick_move');
    },
    //点击治疗事件 弹出alert
    showTreatAlert: function () {
        var self = this;
        Alert.show("此次治疗需要花费***元\n恢复**点成长值",this.treatIcon,function(){
            //回调 播放动画
            
            var animationState = self._chickAnim.play('chick_treat');
            animationState.repeatCount  = 5;
           

        });
    },
    //点击清理事件 弹出alert
    showClearAlert: function () {
        var self = this;
        Alert.show("此次清理需要花费***元\n恢复**点成长值",this.clearIcon,function(){
            self._chickAnim.play('chick_move');
        });
    },
    //点击喂食事件 弹出alert
    showFeedAlert: function () {
        var self = this;
        Alert.show("此次喂食需要花费***元\n恢复**点成长值",this.feedIcon,function(){
            self._chickAnim.play('chick_feed');
        });
    },
    
    onLoad: function(){
        this.init();
    }

    // update (dt) {},
});
