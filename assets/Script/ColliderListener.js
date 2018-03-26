cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //    default: null,
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
  },
  dataList: null,
  // use this for initialization
  onLoad: function() {
    cc.director.getCollisionManager().enabled = true;
    // cc.director.getCollisionManager().enabledDebugDraw = true;
    // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    this.touchingNumber = 0;
  },

  onCollisionEnter: function(other) {
    this.node.color = cc.Color.GREEN;
    this.touchingNumber++;
  },

  onCollisionStay: function(other) {
    // console.log('on collision stay');
  },

  onCollisionExit: function() {
    //碰撞后的状态显示

    this.dataList = JSON.parse(cc.sys.localStorage.getItem("FarmData")); //缓存机制
    this.touchingNumber--;
    if (this.touchingNumber === 0) {
      this.node.color = cc.Color.WHITE;
    }
    //找到当前预置资源
    let id = Number(this.node.name.slice(4));
    let ParentNodes = this.node.parent.parent;
    let PlantNodes = cc.find("Prefab" + id, ParentNodes);
    let PlantNodesTip = cc.find("Prefab" + id + "/New Node/reap", ParentNodes);
    //是否存在预置资源
    if (PlantNodes) {
      //是否成熟并且选择是镰刀收割工具
      if (this.dataList.List[id].state == 3 && this.dataList.toolType == 4) {
        var action = cc.sequence(cc.moveBy(0.3, 0, 20), cc.fadeOut(0.6), cc.callFunc(PlantNodes.removeFromParent));
        PlantNodes.runAction(action);
      }
      //浇水
      if (this.dataList.List[id].jiaoshui && this.dataList.toolType == 1) {
        var action = cc.fadeOut(0.6);
        PlantNodesTip.runAction(action);
      }
      //除草
      if (this.dataList.List[id].chucao && this.dataList.toolType == 2) {
        var action = cc.fadeOut(0.6);
        PlantNodesTip.runAction(action);
      }
      //除虫
      if (this.dataList.List[id].chuchong && this.dataList.toolType == 5) {
        var action = cc.fadeOut(0.6);
        PlantNodesTip.runAction(action);
      }
    }
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
