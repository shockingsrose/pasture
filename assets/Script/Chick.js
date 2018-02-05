// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
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

    this._hpValue = 20;
    this._stateNode = this._parentNode.getChildByName("chickState");
    this._stateNode.active = false;
    // this._hpBar = cc.find("hpBar", this._stateNode).getComponent(cc.ProgressBar);
    // this._hpLabel = cc.find("Value", this._stateNode).getComponent(cc.Label);

    this.showHp();
    // this.playAnim();
  },

  //生成新的粪便
  spawnNewShit: function() {
    if (this._parentNode.getChildByName("shit") == null) {
      this._shitNode = cc.instantiate(this.shitPrefab);
      this._parentNode.addChild(this._shitNode);
      this._shitNode.setPosition(cc.p(200, -200));
      this._shitAnim = this._shitNode.getComponent(cc.Animation);
      this._shitLabel = this._shitNode.getChildByName("count").getComponent(cc.Label);
      this._shitNode.active = false;
    }
  },
  showShit: function() {
    if (this._shitCount > 0) {
      this._shitNode.opacity = 255;
      this._shitNode.active = true;
      this._shitLabel.string = "x" + this._shitCount;
    }
  },
  showHp: function() {
    // this._hpLabel.string = "成长值" + this._hpValue + "%";
    // this._hpBar.progress = this._hpValue / 100;
  },
  onLoad() {
    this.init();

    //方法导出给index.js
    this.chickFunc = {
      playChickAnim: this.playAnim
    };
  },

  update(dt) {
    // this.showShit();
    // this.showHp();
  },

  //小鸡的动画
  playChickMove: function() {
    this._chickAnim.play("chick_move");
  },
  playChickFeed: function() {
    var anim = this._chickAnim.play("chick_feed");
  },
  playChickTreat: function() {
    this._chickAnim.play("chick_treat");
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
