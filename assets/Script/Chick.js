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

  _parentNode: null,
  _chickNode: null,
  // cc.Animation 动画实例
  _chickAnim: null,
  //animation_clip 动画剪辑
  _animMove: null,
  _animFeed: null,
  _animTreat: null,
  //屎的属性
  _shitCount: null,
  _shitLabel: null,
  _shitNode: null,
  _shitAnim: null,
  _timer: null, //用于记录屎的生成时间（定时器）
  //健康值
  _hpNode: null,
  _hpLabel: null,
  _hpBar: null,
  _hpValue: 0,

  init: function() {
    this._chickNode = this.node;
    this._chickAnim = this.node.getComponent(cc.Animation);
    this._animMove = this.node.getComponent(cc.Animation)._clips[0];
    this._animFeed = this.node.getComponent(cc.Animation)._clips[1];
    this._animTreat = this.node.getComponent(cc.Animation)._clips[2];

    this._parentNode = cc.find("Canvas");
    this._shitCount = 0;

    this._hpValue = 20;
    this._hpNode = this._parentNode.getChildByName("HP");
    this._hpBar = cc.find("hpBar", this._hpNode).getComponent(cc.ProgressBar);
    this._hpLabel = cc.find("Value", this._hpNode).getComponent(cc.Label);
    this.showHp();

    this.spawnNewShit();
  },

  playChickMove: function() {
    this._chickAnim.play("click_move");
  },
  playChickFeed: function() {
    this._chickAnim.play("click_feed");
  },
  playChickTreat: function() {
    this._chickAnim.play("click_treat");
  },
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
    this._hpLabel.string = "成长值" + this._hpValue + "%";
    this._hpBar.progress = this._hpValue / 100;
  },
  onLoad() {
    this.init();
    this._timer = setInterval(() => {
      this._shitCount++;
    }, 5000);
  },

  update(dt) {
    this.showShit();
    this.showHp();
  }
});

var ji = new Chick();
