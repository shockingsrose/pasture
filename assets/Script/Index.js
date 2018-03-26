//Chick.js

// 节点不带_   私有变量_

var Data = require("Data");
var Func = Data.func;
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;

cc.Class({
  extends: cc.Component,

  properties: {
    //Chick 节点 Node
    Chick: {
      default: null,
      type: cc.Node
    },
    clearNode: {
      default: null,
      type: cc.Node
    },
    treatIcon: cc.SpriteFrame,
    clearIcon: cc.SpriteFrame,
    feedIcon: cc.SpriteFrame,
    //菜单栏 节点 Node MenuList
    MenuListNode: {
      default: null,
      type: cc.Node
    },
    btnMoreNode: {
      default: null,
      type: cc.Node
    },
    //仓库跳转后执行相应操作
    operate: null
  },
  //Chick.js
  _chick: null,

  _clearValue: null,
  clearLabel: null,
  clearBar: null,
  //菜单 半透明背景 Modal_more
  MenuModal: null,
  btnMoreSprite: null,
  chickFunc: null,
  //清理和喂食动画的节点
  handNode: null,
  handAnim: null,
  _signState: null,
  //点击显示小鸡状态的timer
  timer: null,
  //点击显示饲料槽的timer
  timer2: null,
  //房屋升级状态的timer
  timer3: null,
  feedStateNode: null,
  wether: null,
  arrowNode: null,
  eggNode: null,

  init: function() {
    this._chick = this.Chick.getComponent("Chick");
    this.clearLabel = this.clearNode.getChildByName("Value").getComponent(cc.Label);
    this.clearBar = this.clearNode.getChildByName("heath_bar").getComponent(cc.ProgressBar);
    this.MenuModal = cc.find("/div_menu/Modal_more", this.node);
    this.btnMoreSprite = this.btnMoreNode.getComponent(cc.Sprite);
    this.handNode = cc.find("Hand", this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.arrowNode = this.node.getChildByName("icon-arrow");
    this.eggNode = cc.find("bg/house/egg", this.node);
    this.houseNode = cc.find("bg/house", this.node);
    this.moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);

    //天气
    this.wether = this.node.getChildByName("div_wether");
    //饲料数量
    this.feedCountLabel = cc.find("div_action/feed/icon-tip/count", this.node).getComponent(cc.Label);
    // var chickState = new Chick();
    this.MenuListNode.active = false;
    this.updateWether();
    //新手指引step
    this.step = 0;
  },
  initData(data) {
    //清洁度设置
    Config.firstLogin = data.UserModel.FirstLanding;
    this._clearValue = data.RanchModel.RanchCleanliness;
    this.clearLabel.string = this._clearValue + "%";
    this.clearBar.progress = this._clearValue / 100;

    //金币设置
    var RanchMoney = data.UserModel.RanchMoney;
    let RanchRank = data.RanchModel.RanchRank;
    var moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    var level = cc.find("div_header/me/levelbg/label", this.node).getComponent(cc.Label);
    moneyLabel.string = "￥" + RanchMoney;
    level.string = "V" + data.UserModel.Grade;
    //初始化饲料tip的数量
    this.feedCountLabel.string = data.UserModel.Allfeed == null ? 0 : data.UserModel.Allfeed;

    //初始化鸡蛋
    this.eggNode.active = data.RanchModel.EggCount > 0 ? true : false;
    //初始化房子
    switch (RanchRank) {
      case 1:
        cc.loader.loadRes("house/house_1", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 2:
        cc.loader.loadRes("house/house_2", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 3:
        cc.loader.loadRes("house/house_3", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
    }

    this.initChick();
  },

  //只运行一次
  initChick() {
    Func.GetChickList().then(data => {
      if (data.Code == 1) {
        //初始化鸡是否显示
        let length = data.List.length;
        //最后一只鸡的位置
        let index = length - 1;
        this.Chick.active = length > 0 ? true : false;
        //调用setId接口 给鸡传Id 默认最后那只鸡

        if (this.Chick.active && !data.List[index].IsCallBack) {
          this.Chick.setPosition(0, -140);
          this._chick.setId(data.List[index].ID);
          this._chick._status = data.List[index].Status;
          if (data.List[index].Status === 0) {
            cc.loader.loadRes("ChickAlta/Chick_die", cc.SpriteFrame, (err, spriteFrame) => {
              this.Chick.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              if (this.operate != -1) {
                Msg.show("小鸡已经死亡");
              }
            });
          } else {
            this._chick.initData();
          }
        } else {
          !Config.firstLogin ? Msg.show("您的牧场暂无小鸡") : false;
        }
      } else {
        !Config.firstLogin ? Msg.show("您的牧场暂无小鸡") : false;
      }
    });
  },
  //收取鸡蛋
  collectEgg() {
    Func.CollectEgg().then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggNode.active = false;
          }, this)
        );
        this.eggNode.runAction(action);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //收取贵妃鸡
  collectChick() {
    Func.CollectChick(this._chick._Id).then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.Chick.active = false;
          }, this)
        );
        this.Chick.runAction(action);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //点击治疗事件
  showTreatAlert: function() {
    var self = this;
    //调用接口
    Func.PostTreat(this._chick._Id)
      .then(data => {
        if (data.Code === 1) {
          var animState = self._chick._chickAnim.play("chick_treat");

          this._chick._chickAnim.on("finished", this.chickFunc.initData, this._chick);
        } else if (data.Code == "000") {
          Alert.show(data.Message, this.rechargeEvent, this.treatIcon, "剩余的牧场币不足");
        } else if (data.Code === 333) {
          Msg.show(data.Message);
        } else if (data.Code == 444) {
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击清理事件
  showClearAlert: function() {
    var self = this;
    //调用接口
    Func.PostClean()
      .then(data => {
        if (data.Code === 1) {
          //清洁动画
          this.handNode.active = true;
          this.handAnim.play("hand_clear");

          this.handAnim.on("finished", () => {
            this.handNode.active = false;
            //清洁成功 牧场清洁度=100%
            this.clearLabel.string = 100 + "%";
            this.clearBar.progress = 1;
          });
          this.handAnim.on("finished", this.chickFunc.initData, this._chick);
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击喂食事件
  showFeedAlert: function() {
    var self = this;
    Func.PostOwnFeeds(this._chick._Id).then(data => {
      if (data.Code === 1) {
        this.updateFeedCount();
        var anim = self._chick._chickAnim.play("chick_feed");
        anim.repeatCount = 4;

        this._chick._chickAnim.on("finished", this.chickFunc.initData, this._chick);
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, this.feedIcon, "剩余的饲料不足");
      } else if (data.Code === 333) {
        //饥饿度是满的
        Msg.show(data.Message);
      } else if (data.Code === 444) {
        //鸡死了
        Msg.show(data.Message);
      }
    });
    // .catch(reason => {
    //   Msg.show("failed:" + reason);
    // });
  },
  //将饲料放入饲料槽中
  putFeed() {
    Func.AddFeed().then(data => {
      if (data.Code === 1) {
        let array = data.Model.split(",");
        let value = array[0];
        let capacity = array[1];
        this.assignFeedState(value, capacity);
        this.updateFeedCount();
        //动画
        let handFeedNode = cc.find("hand_feed", this.node);
        handFeedNode.active = true;
        let hanfFeedAnim = handFeedNode.getComponent(cc.Animation);
        hanfFeedAnim.play("hand_feed");
        hanfFeedAnim.on("finished", () => {
          handFeedNode.active = false;
        });
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, "icon-feed", "剩余的饲料不足");
      } else if (data.Code == "333") {
        Msg.show(data.Message);
      }
    });
  },
  //升级饲料槽
  UpFeedGrade() {
    Alert.show("确定要升级饲料槽吗?", this.upGrade, null, "升级饲料槽");
  },
  upGrade() {
    Func.UpFeedGrade().then(data => {
      if (data.Code === 1) {
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //孵化小鸡
  hatchEgg() {
    Func.HatchEgg().then(data => {
      if (data.Code === 1) {
        this.Chick.active = true;
        this.Chick.setPosition(0, -140);
        this._chick.setId(data.Model);
        this._chick._chickAnim.play("chick_born");
        this._chick._chickAnim.on("finished", this._chick.chickFunc.initData, this._chick);
        Msg.show("孵化成功");
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //显示饲料槽状态
  showFeedState() {
    if (this._chick._stateNode != null) this._chick._stateNode.active = false;

    Func.GetFeedData().then(data => {
      if (data.Code == 1) {
        this.arrowNode.active = false;
        let capacity = data.Model.FeedTroughCapacity;
        let value = data.Model.FeedCount;
        this.assignFeedState(value, capacity);

        //显示节点（动画）
        clearTimeout(this.timer2);
        this.feedStateNode.active = true;
        this.feedStateNode.opacity = 0;
        this.feedStateNode.runAction(cc.fadeIn(0.5));
        var action = cc.sequence(
          cc.fadeOut(0.5),
          cc.callFunc(() => {
            this.feedStateNode.active = false;
            this.arrowNode.active = true;
          }, this)
        );
        this.timer2 = setTimeout(() => {
          this.feedStateNode.runAction(action);
        }, 3000);
      } else {
        Alert.show(data.Message);
      }
    });
  },
  //赋值 饲料槽
  assignFeedState(value, capacity) {
    this.feedStateNode = this.node.getChildByName("feedState");
    let feedProgressBar = cc.find("layout/Bar", this.feedStateNode).getComponent(cc.ProgressBar);
    let feedBar = feedProgressBar.node.getChildByName("bar");
    let feedLabel = cc.find("layout/value", this.feedStateNode).getComponent(cc.Label);

    feedLabel.string = value + "/ " + capacity;
    feedProgressBar.progress = value / capacity;
    Tool.setBarColor(feedBar, value / capacity);
  },
  //显示房屋升级弹出框
  showHouseUpgrade() {
    this.houseStateNode = cc.find("bg/house/houseState", this.node);
    Func.GetRanchUpGradeMoney().then(data => {
      if (data.Code === 1) {
        let length = data.List.length || 0;
        let button0 = cc.find("button0", this.houseStateNode);
        let button1 = cc.find("button1", this.houseStateNode);
        for (let i = 0; i < length; i++) {
          if (data.List[i].Type === 0) {
            button0.active = true;
            this.upgradeByPointInfo = data.List[i];
          } else {
            button1.active = true;
            this.upgradeByMoneyInfo = data.List[i];
          }
        }
      } else if (data.Code === 2) {
        this.upgradeByPointInfo.RanchGrade = "S";
        this.upgradeByMoneyInfo.RanchGrade = "S";
      } else {
        Msg.show(data.Message);
        return;
      }
      clearTimeout(this.timer3);
      this.houseStateNode.active = true;
      this.houseStateNode.opacity = 0;
      this.houseStateNode.runAction(cc.fadeIn(0.3));

      var action = cc.sequence(
        cc.fadeOut(0.3),
        cc.callFunc(() => {
          this.houseStateNode.active = false;
        }, this)
      );
      this.timer3 = setTimeout(() => {
        this.houseStateNode.runAction(action);
        // this.houseStateNode.active = false;
      }, 2000);
    });
  },
  upgradeByPoint() {
    if (this.upgradeByPointInfo.RanchGrade === "S") {
      Msg.show("已经升到满级");
    } else {
      Alert.show(
        "是否使用" + this.upgradeByPointInfo.Money + "积分将牧场升级到" + this.upgradeByPointInfo.RanchGrade + "级",
        () => {
          this.upgradeHouse(this.upgradeByPointInfo.Type);
          this.updateMoney();
        },
        null,
        "升级"
      );
    }
  },
  upgradeByMoney() {
    if (this.upgradeByPointInfo.RanchGrade === "S") {
      Msg.show("已经升到满级");
    } else {
      Alert.show(
        "是否使用" + this.upgradeByMoneyInfo.Money + "个牧场币将牧场升级到" + this.upgradeByMoneyInfo.RanchGrade + "级",
        () => {
          this.upgradeHouse(this.upgradeByMoneyInfo.Type);
          this.updateMoney();
        },
        null,
        "升级"
      );
    }
  },
  //升级房屋操作
  upgradeHouse(payType) {
    Func.UpgradeHouse(payType).then(data => {
      if (data.Code === 1) {
        switch (data.Model) {
          case "B":
            cc.loader.loadRes("house/house_2", cc.SpriteFrame, (err, spriteFrame) => {
              this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              Msg.show(data.Message);
            });
            break;
          case "A":
            cc.loader.loadRes("house/house_3", cc.SpriteFrame, (err, spriteFrame) => {
              this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              Msg.show(data.Message);
            });
            break;
        }
      }
    });
  },
  //更新 饲料tip的数量
  updateFeedCount() {
    Func.GetFeedCount().then(data => {
      if (data.Code === 1) {
        this.feedCountLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //更新天气情况
  updateWether() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find("soiltem", this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find("div/date", this.wether).getComponent(cc.Label);
      let wetherIcon = cc.find("div/icon", this.wether).getComponent(cc.Sprite);
      let bgNode = cc.find("bg", this.node);
      let rainNode = cc.find("ParticleRain", this.node);

      let time = res.data.weatherdata[0].intime.split(" ");
      let date = time[0].split("-");
      wetherItem1.string = res.data.weatherdata[0].soiltem + "℃";
      wetherItem2.string = date[1] + "月" + date[2] + "日";
      //根据天气情况 判断牧场的背景
      Func.GetCurrentWeather().then(res => {
        if (res.data.rain !== 0) {
          //下雨
          cc.loader.loadRes("weather/bg-rain", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/rain", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = true;
        } else if (res.data.light === 2 || res.data.light === 3) {
          //阴天
          cc.loader.loadRes("weather/bg-cloud", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/overcast", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        } else if (res.data.light === 1) {
          cc.loader.loadRes("weather/bg", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/sun", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        }
      });
    });
  },
  //显示菜单栏 动画
  showMenu: function() {
    var self = this;

    return new Promise((resolve, reject) => {
      if (!this.MenuListNode.active) {
        //弹出
        cc.loader.loadRes("btn-retract", cc.SpriteFrame, function(err, spriteFrame) {
          self.btnMoreSprite.spriteFrame = spriteFrame;
        });
        var fadeIn = cc.fadeIn(0.3);
        this.MenuModal.runAction(fadeIn);
        this.MenuListNode.active = !this.MenuListNode.active;
        var action = cc.sequence(
          cc.moveTo(0.3, cc.p(0, -50)),
          cc.callFunc(() => {
            resolve(1);
          })
        );

        this.MenuListNode.runAction(action);
      } else {
        //收回
        cc.loader.loadRes("btn-more", cc.SpriteFrame, function(err, spriteFrame) {
          self.btnMoreSprite.spriteFrame = spriteFrame;
        });

        var action = cc.sequence(
          cc.moveTo(0.3, cc.p(0, -800)),
          cc.callFunc(() => {
            this.MenuListNode.active = !this.MenuListNode.active;
          }, this)
        );
        this.MenuListNode.runAction(action);

        //菜单栏 半透明背景
        this.MenuModal.runAction(cc.fadeOut(0.3));
      }
    });
  },
  updateMoney() {
    Func.GetUserMoney().then(data => {
      if (data.Code === 1) {
        this.moneyLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene("weatherInfo");
  },
  //点击充值 跳转场景
  rechargeEvent: function() {
    cc.director.loadScene("recharge");
  },
  loadSceneShop() {
    cc.director.loadScene("shop");
  },
  loadSceneMonitor() {
    cc.director.loadScene("monitor");
  },
  showUserCenter: function() {
    cc.director.loadScene("userCenter");
  },
  loadSceneRepertory() {
    cc.director.loadScene("repertory");
  },

  onLoad: function() {
    var openID = window.location.href.split("=")[1];
    window.Config.openID = openID || "dedbc83d62104d6da8d4a3c0188dc419";
    Func.openID = window.Config.openID;
    //Config.newSocket = new WebSocket("wss://service.linedin.cn:5520");
    Config.newSocket = io.connect("http://service.linedin.cn:5520");
    this.getStorageCount(); //初始化消息数量
    this.socketNotice(); //socket监听消息变化
    this.func = {
      showMenu: this.showMenu,
      loadSceneShop: this.loadSceneShop,
      loadSceneRepertory: this.loadSceneRepertory
    };
  },

  start: function() {
    this.init();
    this.chickFunc = this._chick.chickFunc;
    Func.GetWholeData().then(data => {
      // console.log(data);
      if (data.Code === 1) {
        this.initData(data);
        // 新手指引
        if (Config.firstLogin) GuideSystem.guide();
        //仓库回调

        this.repertoryCallBack();
      } else {
        console.log("首页数据加载失败");
      }
    });
  },
  //读取/暂存消息数量
  getStorageCount() {
    var messageCount = cc.find("div_menu/Menu/MenuList/menuScroll/view/content/message/point01", this.node);
    var messageCount2 = cc.find("div_menu/more/point01", this.node);
    // let StorageCount = cc.sys.localStorage.getItem(Func.openID); //获取缓存
    Func.GetRecordCount().then(data => {
      if (data.Code === 1) {
        if (data.Model > 0) {
          cc.find("label", messageCount).getComponent(cc.Label).string = data.Model;
          cc.find("label", messageCount2).getComponent(cc.Label).string = data.Model;
          messageCount.active = true;
          messageCount2.active = true;
        } else {
          messageCount.active = false;
          messageCount2.active = false;
        }
      } else {
        console.log("首页数据加载失败");
      }
    });
  },
  //socket监听消息变化
  socketNotice() {
    var self = this;
    Config.newSocket.on(Func.openID, data => {
      self.getStorageCount();
    });

    // // Connection opened
    // Config.newSocket.addEventListener("open", function(event) {
    //   Config.newSocket.send("Hello Server!");
    // });

    // // Listen for messages
    // Config.newSocket.addEventListener("message", function(event) {
    //   console.log("Message from server", event.data);
    // });
  },
  //仓库回调函数（0表示孵化操作）
  repertoryCallBack() {
    if (this.operate != null) {
      switch (this.operate) {
        case 0:
          this.hatchEgg();
          break;
        case 1:
          this.putFeed();
          break;
      }
      this.operate = -1;
    }
  },
  gotoFarm() {
    cc.director.loadScene("farm");
  },
  showSickAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.hungry = false;
    this._chick._chickStatus.shit = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showSickHungryAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showShitSickAnim: function() {
    this._chick._chickStatus.sick = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.hungry = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showShitHungryAnim: function() {
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.sick = false;
    this.chickFunc.playChickAnim.call(this._chick);
  },
  showHungrySickShitAnim: function() {
    this._chick._chickStatus.hungry = true;
    this._chick._chickStatus.shit = true;
    this._chick._chickStatus.sick = true;
    this.chickFunc.playChickAnim.call(this._chick);
  }
  //update(dt) {}
});
