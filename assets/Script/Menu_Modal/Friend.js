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
cc.Class({
  extends: cc.Component,

  properties: {
    itemTop3: {
      default: null,
      type: cc.Prefab
    },
    itemFriend: {
      default: null,
      type: cc.Prefab
    },
    itemSearch: {
      default: null,
      type: cc.Prefab
    },
    itemBoth: {
      default: null,
      type: cc.Prefab
    },
    iconBtn01: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn02: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn03: {
      default: null,
      type: cc.SpriteFrame
    }
  },
  closeModal() {
    var self = this;
    console.log("close modal");
    var action = cc.sequence(
      cc.fadeOut(0.3),
      cc.callFunc(() => {
        this.node.active = false;
      }, this.node)
    );
    this.node.runAction(action);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },

  // update (dt) {},

  //绑定数据（好友列表）
  updateData() {
    Func.GetFriendsList(this.friend_page).then(data => {
      if (data.Code === 1) {
        var friendList = data.List;
        this.contentNode = cc.find("bg-repertory/friendList/view/content", this.node);
        for (let i = 0; i < friendList.length; i++) {
          this.assignFriendData(friendList[i]);
        }

        this.friend_page++;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //搜索功能(搜索好友)
  search() {
    //输入框的值
    this.option = 2;
    this.searchStr = this.inputEditBox.string;
    this.contentNode.removeAllChildren();
    this.search_page = 1;
    this.updateSearchData();
  },
  updateSearchData() {
    Func.GetUserList(this.searchStr, this.search_page).then(data => {
      if (data.Code === 1) {
        var friendList = data.List;

        for (let i = 0; i < friendList.length; i++) {
          if (friendList[i].IsFriends) {
            this.assignFriendData(friendList[i], true);
          } else {
            this.assignNoFriendData(friendList[i]);
          }
        }
        this.search_page++;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  bindEvent() {
    //滚动到底部加载数据
    this.friendListNode.on(
      "bounce-bottom",
      () => {
        if (this.option === 1) {
          this.updateData();
        } else {
          this.updateSearchData();
        }
      },
      this
    );

    //input 如果为空 加载好友数据
    this.inputNode.on(
      "text-changed",
      () => {
        if (this.inputEditBox.string == "") {
          this.contentNode.removeAllChildren();
          this.option = 1;
          this.friend_page = 1;
          this.search_page = 1;
          this.contentNode.removeAllChildren;
          this.updateData();
        }
      },
      this
    );
  },
  //sort = true 显示排名
  assignFriendData(data, sort) {
    const element = data;
    var advisor = element.path;
    var name = element.RealName;
    var grade = element.Grade;
    //排名（字段不确定）
    var rank = element.Row || i;
    var clean = element.IsClean;
    var feed = element.IsFeed;

    // 判断加载哪一个prefab
    if (!sort) {
      if (rank <= 3) {
        //Top3
        var item = cc.instantiate(this.itemTop3);
        var rankNode = cc.find("item-content/icon-no2", item);
        switch (rank) {
          case 1:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn01;
            break;
          case 2:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn02;
            break;
          case 3:
            rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn03;
            break;
        }
      } else {
        //大于3 的排名
        var item = cc.instantiate(this.itemFriend);
        var rankLabel = cc.find("item-content/rank/text", item).getComponent(cc.Label);
        rankLabel.string = rank;
      }

      var healthNode = cc.find("item-content/status/health", item);
      var cleanNode = cc.find("item-content/status/clean", item);
      var feedNode = cc.find("item-content/status/feed", item);

      if (clean) {
        cleanNode.active = true;
      }
      if (feed) {
        feedNode.active = true;
      }
    } else {
      //搜索好友 排名不显示
      var item = cc.instantiate(this.itemBoth);
    }

    var advisorSprite = cc.find("item-content/advisor-box/adviosr-mask/advisor", item).getComponent(cc.Sprite);
    var nameLabel = cc.find("item-content/advisor-box/name", item).getComponent(cc.Label);
    var gradeLabel = cc.find("item-content/level-box/textbox/label", item).getComponent(cc.Label);

    nameLabel.string = name;
    gradeLabel.string = "Lv." + grade;

    this.contentNode.addChild(item);
  },
  assignNoFriendData(data) {
    const element = data;
    var advisor = element.path;
    var name = element.RealName;
    var grade = element.Grade;
    let openIds = element.OpenID;
    //排名（字段不确定）

    var item = cc.instantiate(this.itemSearch);

    var advisorSprite = cc.find("item-content/advisor-box/adviosr-mask/advisor", item).getComponent(cc.Sprite);
    var nameLabel = cc.find("item-content/advisor-box/name", item).getComponent(cc.Label);
    var gradeLabel = cc.find("item-content/level-box/textbox/label", item).getComponent(cc.Label);
    let addButton = cc.find("item-content/add", item);

    nameLabel.string = name;
    gradeLabel.string = "Lv." + grade;
    addButton.on(
      "click",
      () => {
        Func.AddFriend(openIds).then(data => {
          if (data.Code === 1) {
            Msg.show(data.Message);

            if (data.Message == "请求成功！") {
              Config.newSocket.emit("add", [Func.openID, openIds]);
              // Config.newSocket.addEventListener("message", function(event) {
              //   console.log("Message from server", event.data);
              // });
            }
          } else {
            Msg.show(data.Code);
          }
        });
      },
      this
    );

    this.contentNode.addChild(item);
  },
  onLoad() {
    this.friendListNode = cc.find("bg-repertory/friendList", this.node);
    this.inputNode = cc.find("bg-repertory/form/input", this.node);
    this.inputEditBox = this.inputNode.getComponent(cc.EditBox);
    this.contentNode = cc.find("bg-repertory/friendList/view/content", this.node);
    this.friend_page = 1;
    this.search_page = 1;
    this.option = 1; // 1代表好友列表  2.代表非好友列表

    this.bindEvent();
    //得到好友列表数据 并调用绑定方法
    this.updateData();
  },
  start() {}
});
