// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html




var Modal = cc.Class({
    extends: cc.Component,

    properties: {
        shopModal_Prefab: {
            default: null,
            type: cc.Prefab
        },
        repertoryModal_Prefab: {
            default: null,
            type: cc.Prefab
        },
        friendModal_Prefab: {
            default: null,
            type: cc.Prefab
        },
        messageModal_Prefab: {
            default: null,
            type: cc.Prefab
        },

        Modal: {
            default: null,
            type: cc.Node
        }
       
    },
    _Modal : null,
    // 动画 
    actionFadeIn: function(x,y){
        var action = cc.moveTo(0.5,cc.p(x,y));
        return action;
    },

    showModal: function (event) {

        var name = event.currentTarget.name;
        this.setModal(name);
        this.Modal.active = true;


        
        this.node.addChild(this._Modal);
        this._Modal.setPosition(0, -this.node.height);

        
        var action = cc.moveTo(0.3, cc.p(0, -this.node.height / 2 + this._Modal.height / 2));
        this._Modal.runAction(action);
        console.log(this.node.getChildByName('modal'));
    },
    closeModal: function () {
        var self = this;
        console.log("close modal");
        this.Modal.active = false;
        
        var action = cc.sequence(cc.moveTo(0.3, cc.p(0, -this.node.height)),cc.callFunc(this._Modal.removeFromParent,this._Modal));
        this._Modal.runAction(action);

         // scrollView.removeFromParent();
        // this.node.removeChild(Modal);
    },

    //判断要弹出哪个Modal 并赋值给this._Modal
    setModal: function(name){
        switch (name) {
            case 'shop':
                this._Modal = cc.instantiate(this.shopModal_Prefab);
                break;
            case 'repertory':
                this._Modal = cc.instantiate(this.repertoryModal_Prefab);
                break;
            case 'friend':
                this._Modal = cc.instantiate(this.friendModal_Prefab);
                break;
            case 'message':
                this._Modal = cc.instantiate(this.messageModal_Prefab);
                break;
        }
    },
    onLoad: function(){
        
        this.Modal.active = false;
        
    }
    // update (dt) {},
});
