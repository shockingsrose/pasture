// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var clickEvent = require('ClickEvent');


var Modal = cc.Class({
    extends: cc.Component,

    properties: {
        treatPrefab: {
            default: null,
            type: cc.Prefab
        },
        Modal: {
            default: null,
            type: cc.Node
        }
       
    },

    showModal: function () {

        
        this.Modal.active = true;


        var treatModal = cc.instantiate(this.treatPrefab);
        this.node.addChild(treatModal);
        treatModal.setPosition(0, -this.node.height / 2 + treatModal.height / 2);

        console.log(this.node.getChildByName('modal'));
    },
    closeModal: function () {
        var self = this;
        console.log("close modal");
        
        this.Modal.active = false;
        var scrollView = this.node.getChildByName("treatScrollView");
        scrollView.removeFromParent();
        
        // this.node.removeChild(Modal);
    },
    onLoad: function(){
        
        this.Modal.active = false;
    }
    // update (dt) {},
});
