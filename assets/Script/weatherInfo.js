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
    itemList_perfab: {
      default: null,
      type: cc.Prefab
    },
    item_perfab: {
      default: null,
      type: cc.Prefab
    }
  },
  //itemList插入的位置
  contentNode: null,
  //获取天气数据 （index表示当前页 size表示加载多少页）
  index: null,
  size: null,
  onLoad() {
    this.scrollviewNode = cc.find("ScrollView", this.node);
    this.titleScrollNode = cc.find("titleScrollView", this.node);
    //scrollView 组件
    this.scrollView = this.scrollviewNode.getComponent(cc.ScrollView);
    this.titleScrollView = this.titleScrollNode.getComponent(cc.ScrollView);
    //内容节点（插入数据）
    this.contentNode = cc.find("ScrollView/view/content", this.node);
    this.index = 1;
    this.size = 4;
    //加载数据
    this.updateData();
    //滑动到最右侧 加载数据
    this.scrollviewNode.on("bounce-right", this.updateData, this);
    //同步滑动
    this.titleScrollNode.on("scrolling", this.titleScrollEvent, this);
    this.scrollviewNode.on("scrolling", this.scrollEvent, this);
  },
  //加载数据
  updateData() {
    Func.GetWetherData(this.index, this.size).then(res => {
      let data = res.data.weatherdata;
      for (let i = 0; i < data.length; i++) {
        let info = data[i];
        //筛选数据
        let array = [
          info.light,
          info.rain,
          info.tem,
          info.hum,
          info.winds,
          info.windd,
          info.pa,
          info.co2,
          info.soiltem,
          info.soilwater,
          info.ec,
          info.noi,
          info.power,
          info.intime
        ];
        //一列数据加载
        let itemListNode = cc.instantiate(this.itemList_perfab);
        for (let value of array) {
          let itemNode = cc.instantiate(this.item_perfab);
          let itemLabel = cc.find("label", itemNode).getComponent(cc.Label);
          itemLabel.string = value;

          itemListNode.addChild(itemNode);
        }

        this.contentNode.addChild(itemListNode);
      }
      this.index += 1;
    });
  },
  //title 移动事件
  titleScrollEvent() {
    let pos_title = this.titleScrollView.getContentPosition();
    let pos_content = this.scrollView.getContentPosition();

    this.scrollView.setContentPosition(cc.v2(pos_content.x, pos_title.y));
  },
  //右侧数据内容 移动事件
  scrollEvent() {
    let pos_title = this.titleScrollView.getContentPosition();
    let pos_content = this.scrollView.getContentPosition();

    this.titleScrollView.setContentPosition(cc.v2(pos_title.x, pos_content.y));
  },
  start() {},
  loadSceneIndex() {
    cc.director.loadScene("index");
  }
  //   update(dt) {
  //     //console.log(this.scrollviewNode.getComponent(cc.ScrollView).getContentPosition());
  //   }
});
