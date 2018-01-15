// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//Chick.js 
var Chick = require('Chick');

cc.Class({
    extends: cc.Component,
 
    properties: {
        //Chick 节点 Node
        Chick: {
            default: null,
            type: cc.Node
        },
       treatIcon: cc.SpriteFrame,
       clearIcon: cc.SpriteFrame,
       feedIcon: cc.SpriteFrame,
    },
    //Chick.js 
    _chick: null,
   
    

    init: function(){
        this._chick = this.Chick.getComponent('Chick');
        var chickState = new Chick();
        
    },
    //点击治疗事件 弹出alert
    showTreatAlert: function () {
        var self = this;
        Alert.show("此次治疗需要花费***元\n恢复**点成长值",this.treatIcon,function(){
            self._chick._chickAnim.play('chick_treat');
            setTimeout(() => {
                self._chick._chickAnim.play('chick_move');
            }, 5000);
        });
    },
    //点击清理事件 弹出alert
    showClearAlert: function () {
        var self = this;
        if(this._chick._shitCount > 0){
            Alert.show("此次清理需要花费***元\n恢复**点成长值",this.clearIcon,function(){
                self._chick._shitAnim.play('shit');
                self._chick._shitCount = 0;
                clearInterval(self._chick._timer);
                self._chick._timer = setInterval(() => {self._chick._shitCount ++},5000);
            });
        }else{
            Alert.show("暂时不需要清理",this.clearIcon);
        }
       
    },
    //点击喂食事件 弹出alert
    showFeedAlert: function () {
        var self = this;
        Alert.show("此次喂食需要花费***元\n恢复**点成长值",this.feedIcon,function(){
            self._chick._chickAnim.play('chick_feed');
            setTimeout(() => {
                self._chick._chickAnim.play('chick_move');
            }, 5000);
            //成长值 +1
            self._chick._hpValue += 1;
        });

        
    },

    spawnNewShit: function(){

    },
    
    start: function(){
        this.init();
    }

    // update (dt) {},
});
