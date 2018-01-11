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
    anim_move: null,
    anim_feed: null,
    anim_treat: null,

    init: function(){
        this.anim_move = this.node.getComponent(cc.Animation)._clips[0];
        this.anim_feed = this.node.getComponent(cc.Animation)._clips[1];
        this.anim_treat = this.node.getComponent(cc.Animation)._clips[2];
        
    },
    
    playRun: function(){
        

    },
    onLoad () {
        this.init();
    },

    
    // update (dt) {},
});
