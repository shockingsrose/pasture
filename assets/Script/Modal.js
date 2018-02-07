// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Data = require("Data");
var Func = Data.func;
var Modal = cc.Class({
  extends: cc.Component,

  properties: {
    // shopModal_Prefab: {
    //   default: null,
    //   type: cc.Prefab
    // },
    AlertTemp_Prefab: {
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
    signInModal_Prefab: {
      default: null,
      type: cc.Prefab
    },
    shareModal_Prefab: {
      default: null,
      type: cc.Prefab
    },
    Modal: {
      default: null,
      type: cc.Node
    }
  },
  _Modal: null,
  // 动画

  showModal: function(event, data) {
    //console.log(data); customEventData

    var name = event.currentTarget.name;
    this.setModal(name);

    var modal_name = this._Modal.name;
    if (modal_name == "default") {
      Alert.show("该功能还在开发中");
      return;
    }
    if (!this.node.getChildByName(modal_name)) {
      //Modal如果不存在 将Modal预制资源添加到Canvas
      this.node.addChild(this._Modal, 2);
    }
    this.RunAction(data); //默认
  },
  closeModal: function() {
    var self = this;
    console.log("close modal");
    this.Modal.active = false;

    var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this._Modal.removeFromParent, this._Modal));
    this._Modal.runAction(action);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },

  //判断要弹出哪个Modal 并赋值给this._Modal
  setModal: function(name) {
    this._Modal = {}; //初始化
    switch (name) {
      case "shop":
        cc.director.loadScene("shop");
        break;

      case "telModel":
        this._Modal = cc.instantiate(this.AlertTemp_Prefab);
        var cancelButton = cc.find("close", this._Modal);
        cancelButton.on("click", () => {
          var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this._Modal.removeFromParent, this._Modal));
          this._Modal.runAction(action);
        });
        break;
      case "repertory":
        this._Modal = cc.instantiate(this.repertoryModal_Prefab);
        break;
      case "btn-friend":
        // 如果不存在 加载预制资源     存在 this._Modal等于该节点
        if (!this.node.getChildByName("FriendView")) {
          this._Modal = cc.instantiate(this.friendModal_Prefab);
        } else {
          this._Modal = this.node.getChildByName("FriendView");
        }
        break;
      case "btn-share":
        this._Modal = cc.instantiate(this.shareModal_Prefab);
        var cancelButton = cc.find("bg-share/btn-cancel", this._Modal);
        cancelButton.on("click", () => {
          var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this._Modal.removeFromParent, this._Modal));
          this._Modal.runAction(action);
        });
        break;
      case "sign":
        if (!this.node.getChildByName("signIn")) {
          this._Modal = cc.instantiate(this.signInModal_Prefab);
        } else {
          this._Modal = this.node.getChildByName("signIn");
        }
        break;
      case "message":
        this._Modal = cc.instantiate(this.messageModal_Prefab);
        var cancelButton = cc.find("close", this._Modal);
        cancelButton.on("click", () => {
          var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this._Modal.removeFromParent, this._Modal));
          this._Modal.runAction(action);
        });
        break;
      case "me":
        this._Modal.name = "default"; //开发中
        break;
      case "activity":
        this._Modal.name = "default"; //开发中
        break;
    }
  },
  //弹出动画 （默认fadeIn）
  RunAction(type) {
    var action = null;
    switch (type) {
      case "fadeIn":
        this._Modal.active = true;
        this._Modal.opacity = 0;
        action = cc.fadeIn(0.3);
        this._Modal.runAction(action);
        break;
      case "moveIn":
        var shareNode = cc.find("bg-share", this._Modal);
        action = cc.moveTo(0.3, cc.p(0, -474));
        shareNode.runAction(action);
        break;
      default:
        this._Modal.active = true;
        this._Modal.opacity = 0;
        action = cc.fadeIn(0.3);
        this._Modal.runAction(action);
        break;
    }

    return action;
  },
  onLoad: function() {
    // this.Modal.active = false;
  }
  // update (dt) {},
});
