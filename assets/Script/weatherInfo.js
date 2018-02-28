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
    this.contentNode = cc.find("ScrollView/view/content", this.node);
    this.index = 1;
    this.size = 4;
    this.assignData();
    this.scrollviewNode.on("bounce-right", this.assignData, this);
  },
  assignData() {
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
  updateData() {},
  start() {},
  loadSceneIndex() {
    cc.director.loadScene("index");
  }

  // update (dt) {},
});
