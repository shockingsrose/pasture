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
var Chick = cc.Class({
  name: Chick,
  extends: cc.Component,

  properties: {
    shitPrefab: {
      default: null,
      type: cc.Prefab
    }
  },

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
  _hpBar: null,
  _hpValue: 0,
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
    this._shitCount = 0;

    this._stateNode = this._parentNode.getChildByName("chickState");
    this._stateNode.active = false;
    // this._hpBar = cc.find("hpBar", this._stateNode).getComponent(cc.ProgressBar);
    // this._hpLabel = cc.find("Value", this._stateNode).getComponent(cc.Label);

    //获得小鸡的ID （小鸡列表点击小鸡 把Id赋值过来）

    this.assignChickState();
    // this.playAnim();
  },
  setId(Id) {
    this._Id = Id;
    this.initData();
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

        this.playAnim();
      } else {
        Msg.show("服务器忙");
      }
    });
  },
  //给小鸡状态赋值
  assignChickState: function(sp, hp, hungryState, sickState) {
    var spBar = cc.find("pd-20/sp/spBar", this._stateNode).getComponent(cc.ProgressBar);
    var spLabel = cc.find("pd-20/sp/value", this._stateNode).getComponent(cc.Label);
    var hpBar = cc.find("pd-20/hp/hpBar", this._stateNode).getComponent(cc.ProgressBar);
    var hpLabel = cc.find("pd-20/hp/value", this._stateNode).getComponent(cc.Label);
    var spStateLabel = cc.find("pd-20/state/state-box/sp_label", this._stateNode).getComponent(cc.Label);
    var hpStateLabel = cc.find("pd-20/state/state-box/hp_label", this._stateNode).getComponent(cc.Label);

    spBar.progress = sp / 100;
    spLabel.string = sp + "/100";
    hpBar.progress = hp / 100;
    hpLabel.string = hp + "/100";
    spStateLabel.string = hungryState ? "饥饿" : "饱腹";
    hpStateLabel.string = sickState ? "生病" : "健康";
  },
  onLoad() {
    this.init();

    //方法导出给index.js
    this.chickFunc = {
      playChickAnim: this.playAnim,
      assignChickState: this.assignChickState,
      setId: this.setId
    };
  },
  //显示小鸡的状态
  showChickState: function() {
    Func.GetChickValueById(this._Id)
      .then(data => {
        if (data.Code == 1) {
          var sp = data.StarvationValue;
          var hp = data.HealthValue;
          //给小鸡的饥饿度和健康值赋值
          this.assignChickState(sp, hp, data.Hungry, data.Sick);

          // //给小鸡的状态赋值
          // var spLabel = cc.find("pd-20/state/state-box/sp_label", this._stateNode).getComponent(cc.Label);
          // var hpLabel = cc.find("pd-20/state/state-box/hp_label", this._stateNode).getComponent(cc.Label);
          // spLabel.string = data.Hungry ? "饥饿" : "饱腹";
          // hpLabel.string = data.Sick ? "生病" : "健康";

          //显示节点（动画）
          clearTimeout(this.timer);
          this._stateNode.active = true;
          // var hpBar = cc.find("hpBar", this._chick._stateNode);
          // //取消级联透明度的设置  不会继承父级opacity（不设置会导致Mask失效）
          // hpBar.cascadeOpacity = false;
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
  },
  playChickHungry: function() {
    this._chickAnim.play("chick_hungry");
  },
  playChickSick: function() {
    this._chickAnim.play("chick_sick");
  },
  playChickSickHungry: function() {
    this._chickAnim.play("chick_sick_hungry");
  },
  playChickSickShit: function() {
    this._chickAnim.play("chick_shit_sick");
  },
  playChickShitHungry: function() {
    this._chickAnim.play("chick_shit_hungry");
  },
  playChickShitHungrySick: function() {
    this._chickAnim.play("chick_hungry_sick_shit");
  },

  //根据小鸡的状态 播放不同的动画
  playAnim: function() {
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
});
