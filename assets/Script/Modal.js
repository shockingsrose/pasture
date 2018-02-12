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
var utils = require("utils");
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
    NameEditModal_Prefab: {
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
    //信息模态框
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
    },
    //信息列表列表预置
    MessageItem_Prefab: {
      default: null,
      type: cc.Prefab
    },
    //今日、昨日、更早判断
    today: true,
    yesterday: true,
    more: true,
    //分页
    pageIndex: 1,
    pageSize: 5,
    itemBox: null,
    //是否还有数据
    hasMore: true
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
      //修改昵称
      case "edit":
        this.EditName();
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
        //容器
        this.itemBox = cc.find("alertBackground/scrollview/view/layout", this._Modal);
        //监听滚动时间
        const addListenScroll = cc.find("alertBackground/scrollview", this._Modal);
        addListenScroll.on("scroll-to-bottom", this.updataByBottom, this);
        var cancelButton = cc.find("close", this._Modal);
        //关闭模态框
        cancelButton.on("click", () => {
          var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this._Modal.removeFromParent, this._Modal));
          this._Modal.runAction(action);
          this.clearData();
          this.hasMore = true;
        });
        this.MessageLst();
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
  //模态框修改昵称
  EditName() {
    this._Modal = cc.instantiate(this.NameEditModal_Prefab);
    var cancelButton = cc.find("close", this._Modal);
    var saveButton = cc.find("alertBackground/enterButton", this._Modal);
    //取消
    cancelButton.on("click", () => {
      var action = cc.sequence(cc.fadeOut(0.1), cc.callFunc(this._Modal.removeFromParent, this._Modal));
      this._Modal.runAction(action);
    });
    //保存
    saveButton.on("click", () => {
      let name = cc.find("alertBackground/input/editbox", this._Modal);
      let title = cc.find("alertBackground/intro/detailLabel", this._Modal).getComponent(cc.Label);
      let intro = cc.find("alertBackground/intro/tel", this._Modal);
      Data.func.SaveEditName(name.getComponent(cc.EditBox).string).then(data => {
        if (data.Code == 1 || data.Code == 0) {
          intro.getComponent(cc.Label).string = "修改成功！";
        } else if (data.Code == "333") {
          intro.getComponent(cc.Label).string = "您修改的昵称已经存在！";
        } else if (data.Code == "000") {
          intro.getComponent(cc.Label).string = "您的牧场币不足200！无法修改！";
        }
        title.string = "温馨提示";
        intro.getComponent(cc.Label).fontSize = 28;
        intro.getComponent(cc.Label).lineHeight = 80;
        saveButton.active = false;
        name.active = false;
      });
    });
  },
  //信息列表 分页
  MessageLst() {
    const newDate = utils.fn.formatStringToDate(new Date());

    Data.func.UserMessage(this.pageIndex, this.pageSize).then(data => {
      console.log(data);

      if (data.Code) {
        let imgSrc;
        if (data.List.length == 0) {
          return (this.hasMore = false);
        }
        for (let i = 0; i < data.List.length; i++) {
          let item = cc.instantiate(this.MessageItem_Prefab);
          let left_icon = cc.find("today-msg", item).getComponent(cc.Sprite);
          let msg_title = cc.find("right/message-textbg/time", item).getComponent(cc.Label);
          let msg_content = cc.find("right/message-textbg/text", item).getComponent(cc.Label);
          if (utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) == 0 && this.today) {
            imgSrc = "Modal/message/today-msg";
            this.today = false;
          } else if (utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) == 0) {
            imgSrc = "Modal/message/notip-msg";
          } else if (
            utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) == 1 &&
            this.yesterday
          ) {
            imgSrc = "Modal/message/yesterday-msg";
            this.yesterday = false;
          } else if (utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) == 1) {
            imgSrc = "Modal/message/notip-msg";
          } else if (utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) == 2 && this.more) {
            imgSrc = "Modal/message/more-msg";
            this.more = false;
          } else if (utils.fn.DateDiff(newDate, utils.fn.formatNumToDate(data.List[i].CreateTime)) >= 2) {
            imgSrc = "Modal/message/noall";
          }

          cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
            left_icon.spriteFrame = spriteFrame;
          });
          msg_title.string =
            utils.fn.formatNumToDate(data.List[i].CreateTime) +
            " " +
            utils.fn.formatNumToDateTime(data.List[i].CreateTime);
          msg_content.string = data.List[i].Remark;
          this.itemBox.addChild(item);
        }
      } else {
        console.log(data.Message);
      }
    });
  },
  //上拉触底刷新数据
  updataByBottom() {
    if (this.hasMore) {
      this.pageIndex++;
      this.MessageLst();
    } else {
      this.clearData();
    }
  },
  //清除数据 我们从头再来
  clearData() {
    this.pageIndex = 1;
    this.pageSize = 5;
    this.today = true;
    this.yesterday = true;
    this.more = true;
  },
  onLoad: function() {
    // this.Modal.active = false;
  }
  // update (dt) {},
});
