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
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;
var Chick = cc.Class({
  name: Chick,
  extends: cc.Component,

  properties: {},

  // 鸡的状态
  _Id: null,
  _parentNode: null,
  _chickNode: null,
  // cc.Animation 动画实例
  _chickAnim: null,
  //animation_clip 动画剪辑
  _animMove: null,
  _animFeed: null,
  _animTreat: null,
  _animHungry: null,
  _animSick: null,

  //屎的属性
  _shitCount: null,
  _shitLabel: null,
  _shitNode: null,
  _shitAnim: null,
  _timer: null, //用于记录屎的生成时间（定时器）
  //小鸡状态Node
  _stateNode: null,
  _hpLabel: null,
  _hpProgressBar: null,
  _hpValue: 0,
  _status: null, //判断小鸡是否活着
  chickFunc: null,
  init: function() {
    //鸡的状态初始化
    this._chickStatus = {
      sick: true,
      hungry: true,
      shit: true
    };

    //节点的绑定
    this._chickNode = this.node;
    this._chickAnim = this.node.getComponent(cc.Animation);
    this._animMove = this.node.getComponent(cc.Animation)._clips[0];
    this._animFeed = this.node.getComponent(cc.Animation)._clips[1];
    this._animTreat = this.node.getComponent(cc.Animation)._clips[2];
    this._animHungry = this.node.getComponent(cc.Animation)._clips[3];
    this._animSick = this.node.getComponent(cc.Animation)._clips[4];
    this._parentNode = cc.find("Canvas");
    this.feedStateNode = cc.find("feedState", this._parentNode);
    this._shitCount = 0;

    this._stateNode = this._parentNode.getChildByName("chickState");
    //收取鸡的按钮节点
    this._collectNode = cc.find("pd-20/state/collect", this._stateNode);
    this._collectButton = this._collectNode.getComponent(cc.Button);
    this._stateNode.active = false;

    //初始化小鸡Id为-1
    this._Id = -1;
    //获得小鸡的ID （小鸡列表点击小鸡 把Id赋值过来）
  },
  setId(Id) {
    this._Id = Id;
  },
  //初始化鸡的状态 播放不同的动画
  initData() {
    Func.GetChickById(this._Id).then(data => {
      if (data.Code === 1) {
        let chick_data = data.Model;
        let shitStatus = chick_data.Shit;
        let sickStatus = chick_data.Sick;
        let hungryStatus = chick_data.Hungry;
        this._chickStatus.shit = shitStatus;
        this._chickStatus.sick = sickStatus;
        this._chickStatus.hungry = hungryStatus;
        this._status = chick_data.Status;

        this.playAnim();
      } else {
        Msg.show("服务器忙");
      }
    });
  },
  //给小鸡状态赋值 (饥饿值，健康值，成长值，饥饿状态，生病状态，是否能被收取，健康状态)
  assignChickState: function(sp, hp, GrowthValue, hungryState, sickState, collected, status) {
    var spProgressBar = cc.find("pd-20/sp/spBar", this._stateNode).getComponent(cc.ProgressBar);
    var spBar = spProgressBar.node.getChildByName("bar");
    var spLabel = cc.find("pd-20/sp/value", this._stateNode).getComponent(cc.Label);
    var hpProgressBar = cc.find("pd-20/hp/hpBar", this._stateNode).getComponent(cc.ProgressBar);
    var hpBar = hpProgressBar.node.getChildByName("bar");
    var hpLabel = cc.find("pd-20/hp/value", this._stateNode).getComponent(cc.Label);
    var growProgressBar = cc.find("pd-20/grow/Bar", this._stateNode).getComponent(cc.ProgressBar);
    var growBar = growProgressBar.node.getChildByName("bar");
    var growLabel = cc.find("pd-20/grow/value", this._stateNode).getComponent(cc.Label);
    var spStateLabel = cc.find("pd-20/state/state-box/sp_label", this._stateNode).getComponent(cc.Label);
    var hpStateLabel = cc.find("pd-20/state/state-box/hp_label", this._stateNode).getComponent(cc.Label);

    spProgressBar.progress = sp / 100;
    Tool.setBarColor(spBar, sp / 100);
    spLabel.string = sp + "/100";

    hpProgressBar.progress = hp / 100;
    Tool.setBarColor(hpBar, hp / 100);
    hpLabel.string = hp + "/100";

    growProgressBar.progress = GrowthValue / 100;

    growLabel.string = GrowthValue.toFixed(1) + "%";

    spStateLabel.string = hungryState ? "饥饿" : "饱腹";
    Tool.setLabelColor(spStateLabel, sp / 100);
    //根据status判断健康情况
    switch (status) {
      case 0:
        hpStateLabel.string = "死亡";

        break;
      case 1:
        hpStateLabel.string = "生病";
        break;
      case 2:
        hpStateLabel.string = "健康受损";
        break;
      case 3:
        hpStateLabel.string = "亚健康";
        break;
      case 4:
        hpStateLabel.string = "健康";
        break;
    }
    Tool.setLabelColor(hpStateLabel, hp / 100);
    //判断是否能呗收取
    if (collected) {
      this._collectButton.interactable = true;
      this._collectNode.color = cc.color("#FF4A4A");
    } else {
      this._collectButton.interactable = false;
      this._collectNode.color = cc.color("#d6d6d6");
    }
  },

  onLoad() {
    this.init();

    //方法导出给index.js
    this.chickFunc = {
      playChickAnim: this.playAnim,
      assignChickState: this.assignChickState,
      setId: this.setId,
      initData: this.initData
    };
  },
  //小鸡说话
  sayHello() {
    let words = [
      "我饿了，我要吃饭饭",
      "我可以找朋友玩吗？",
      "不要吃我，我会下蛋！",
      "心情不好，我能吃个烤串吗？",

      "主人是大傻瓜！",
      "祝你天天开心，恭喜发财！",
      "我明天吃点什么呢？",
      "过年了，想穿新衣服啦！"
    ];
    this.wordNode = cc.find("dialog/word", this._stateNode);
    let wordLabel = this.wordNode.getComponent(cc.Label);
    if (this._status === 0) {
      wordLabel.string = "我死了";
      return;
    }
    if (!this._chickStatus.sick && !this._chickStatus.hungry && !this._chickStatus.shit) {
      let n = Math.floor(Math.random() * words.length + 1) - 1;
      let str = words[n];

      wordLabel.string = str;
    } else {
      if (this._chickStatus.sick && this._chickStatus.hungry && this._chickStatus.shit) {
        wordLabel.string = "我生病了、又饿了，牧场也不干净了";
      }

      if (this._chickStatus.sick) {
        //生病状态
        !this._chickStatus.hungry && !this._chickStatus.shit ? (wordLabel.string = "我生病了") : false;
        //生病+饥饿状态
        this._chickStatus.hungry && !this._chickStatus.shit ? (wordLabel.string = "我生病了,又饿了") : false;
        //生病+肮脏状态
        !this._chickStatus.hungry && this._chickStatus.shit ? (wordLabel.string = "我生病了，牧场也不干净了") : false;
      }
      if (this._chickStatus.hungry) {
        //饥饿状态
        !this._chickStatus.sick && !this._chickStatus.shit ? (wordLabel.string = "我饿了") : false;
        //饥饿+肮脏状态
        !this._chickStatus.sick && this._chickStatus.shit ? (wordLabel.string = "我饿了，牧场也不干净了") : false;
        //饥饿+生病状态
        this._chickStatus.sick && this._chickStatus.shit ? (wordLabel.string = "我生病了、又饿了") : false;
      }
      if (this._chickStatus.shit) {
        //肮脏状态
        !this._chickStatus.hungry && !this._chickStatus.sick ? (wordLabel.string = "牧场不干净了") : false;
        //肮脏+饥饿状态
        this._chickStatus.hungry && !this._chickStatus.sick ? (wordLabel.string = "我饿了，牧场也不干净了") : false;
        //肮脏+生病状态
        !this._chickStatus.hungry && this._chickStatus.sick ? (wordLabel.string = "我生病了，牧场也不干净了") : false;
      }
    }
  },

  //显示小鸡的状态
  showChickState: function() {
    this.feedStateNode.active = false;
    Func.GetChickValueById(this._Id)
      .then(data => {
        if (data.Code == 1) {
          var sp = data.StarvationValue;
          var hp = data.HealthValue;
          var growth = data.Proportion;
          //判断鸡是否能收取
          let collect = data.CallBack;
          //给小鸡的饥饿度和健康值赋值
          this.assignChickState(sp, hp, growth, data.Hungry, data.Sick, collect, data.Status);
          this.sayHello();
          //显示节点（动画）
          clearTimeout(this.timer);
          this._stateNode.active = true;

          this._stateNode.opacity = 0;
          this._stateNode.runAction(cc.fadeIn(0.3));
          var action = cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
              this._stateNode.active = false;
            }, this)
          );
          this.timer = setTimeout(() => {
            this._stateNode.runAction(action);
          }, 2000);
        } else {
          Alert.show(data.Message);
        }
      })
      .catch(reason => {
        Alert.show("failed:" + reason);
      });
  },
  update(dt) {},

  //小鸡的动画
  playChickMove: function() {
    this._chickAnim.play("chick_move");
  },
  playChickFeed: function() {
    var anim = this._chickAnim.play("chick_feed");
  },
  playChickTreat: function() {
    let anim = this._chickAnim.play("chick_treat");
    anim.repeatCount = 3;
  },
  playChickShit: function() {
    this._chickAnim.play("chick_shit");
    // Msg.show("牧场不干净了");
  },
  playChickHungry: function() {
    this._chickAnim.play("chick_hungry");
    // Msg.show("小鸡饿了");
  },
  playChickSick: function() {
    this._chickAnim.play("chick_sick");
    // Msg.show("小鸡生病了");
  },
  playChickSickHungry: function() {
    this._chickAnim.play("chick_sick_hungry");
    // Msg.show("小鸡饿了，小鸡生病了");
  },
  playChickSickShit: function() {
    this._chickAnim.play("chick_shit_sick");
    // Msg.show("牧场不干净了，小鸡生病了");
  },
  playChickShitHungry: function() {
    this._chickAnim.play("chick_shit_hungry");
    // Msg.show("牧场不干净了，小鸡饿了");
  },
  playChickShitHungrySick: function() {
    this._chickAnim.play("chick_hungry_sick_shit");
    // Msg.show("牧场不干净了，小鸡生病了，小鸡饿了");
  },

  //根据小鸡的状态 播放不同的动画
  playAnim: function() {
    if (this._status != 0) {
      if (this._chickStatus.sick && this._chickStatus.hungry && this._chickStatus.shit) {
        this.playChickShitHungrySick();
        return;
      }
      if (!this._chickStatus.sick && !this._chickStatus.hungry && !this._chickStatus.shit) {
        this.playChickMove();
        return;
      }
      if (this._chickStatus.sick) {
        //生病状态
        !this._chickStatus.hungry && !this._chickStatus.shit ? this.playChickSick() : false;
        //生病+饥饿状态
        this._chickStatus.hungry && !this._chickStatus.shit ? this.playChickSickHungry() : false;
        //生病+肮脏状态
        !this._chickStatus.hungry && this._chickStatus.shit ? this.playChickSickShit() : false;
      }
      if (this._chickStatus.hungry) {
        //饥饿状态
        !this._chickStatus.sick && !this._chickStatus.shit ? this.playChickHungry() : false;
        //饥饿+肮脏状态
        !this._chickStatus.sick && this._chickStatus.shit ? this.playChickShitHungry() : false;
        //饥饿+生病状态
        this._chickStatus.sick && this._chickStatus.shit ? this.playChickSickHungry() : false;
      }
      if (this._chickStatus.shit) {
        //肮脏状态
        !this._chickStatus.hungry && !this._chickStatus.sick ? this.playChickShit() : false;
        //肮脏+饥饿状态
        this._chickStatus.hungry && !this._chickStatus.sick ? this.playChickShitHungry() : false;
        //肮脏+生病状态
        !this._chickStatus.hungry && this._chickStatus.sick ? this.playChickSickShit() : false;
      }
    }
  }
});
