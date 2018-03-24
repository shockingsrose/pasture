cc.Class({
  extends: cc.Component,

  properties: {
    Tool_Prefab: {
      default: null,
      type: cc.Prefab
    },
    Item_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  Value: null,
  Prefab: null,
  onLoad() {
    var self = this;

    this.fatchData();
    this.getToolPositon();
  },
  //加载植物
  fatchData() {
    this.Value = {
      List: [
        { jiaoshui: false, chucao: false, chuchong: false, state: 0 },
        { jiaoshui: false, chucao: true, chuchong: false, state: 1 },
        { jiaoshui: true, chucao: false, chuchong: false, state: 2 },
        { jiaoshui: false, chucao: false, chuchong: true, state: 2 },
        { jiaoshui: false, chucao: false, chuchong: false, state: 3 },
        { jiaoshui: false, chucao: false, chuchong: false, state: 3 },
        { jiaoshui: true, chucao: false, chuchong: false, state: 1 },
        { jiaoshui: false, chucao: false, chuchong: false, state: 3 },
        { jiaoshui: false, chucao: false, chuchong: false, state: 0 },
        { jiaoshui: false, chucao: true, chuchong: false, state: 2 }
      ],
      toolType: 0
    };
    //缓存数据并加载植物
    cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value)); //缓存机制
    for (let i = 0; i < this.Value.List.length; i++) {
      this.fatchPlant(i, this.Value.List);
    }
  },
  fatchPlant(i, ValueList) {
    var self = this;

    let bg = cc.find("bg", this.node);
    let Prefab = cc.instantiate(self.Item_Prefab);
    let PrefabPlant_xs = cc.find("plant-xs", Prefab);
    let PrefabPlant_md = cc.find("plant-md", Prefab);
    let PrefabPlant_lg = cc.find("plant-lg", Prefab);
    let PrefabPlant_tip = cc.find("New Node/reap", Prefab);
    //提示图标的类型切换
    self.setTipType(ValueList[i], PrefabPlant_tip);
    let itemBox = cc.find("bg/mapNew/item" + i, this.node);
    let itemPos = itemBox.getPosition();
    let pos = itemBox.getNodeToWorldTransformAR(itemPos);

    if (ValueList[i].state == 1) {
      //小树苗
      PrefabPlant_xs.active = true;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = false;
    } else if (ValueList[i].state == 2) {
      //中端
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = true;
      PrefabPlant_lg.active = false;
    } else if (ValueList[i].state == 3) {
      //成熟
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = true;
      PrefabPlant_tip.active = true; //显示可收割
    }
    //重置名字赋值
    Prefab.name = "Prefab" + i;
    //定位于碰撞事件触发的点
    Prefab.setPosition(pos.tx, pos.ty);
    bg.addChild(Prefab);
  },
  //提示图标的类型切换
  setTipType(ValueList, obj) {
    if (ValueList.jiaoshui && ValueList.state != 0) {
      cc.loader.loadRes("Farm/water", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    } else if (ValueList.chucao && ValueList.state != 0) {
      cc.loader.loadRes("Farm/weed", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    } else if (ValueList.chuchong && ValueList.state != 0) {
      cc.loader.loadRes("Farm/worm", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },
  start() {},
  //监听触摸
  getToolPositon() {
    let self = this;
    let farmBox = cc.find("bg", this.node);
    let tool = cc.find("tool", this.node);
    tool.on("touchstart", function(e) {
      if (self.Value.toolType != 0) {
        self.Prefab = cc.instantiate(self.Tool_Prefab);
        let Img = cc.find("tool", self.Prefab).getComponent(cc.Sprite);
        cc.loader.loadRes(self.imgSrcSelect(), cc.SpriteFrame, function(err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        self.Prefab.setPosition(e.getLocation());
        farmBox.addChild(self.Prefab);
      }
    });
    tool.on("touchmove", function(e) {
      if (self.Value.toolType != 0) {
        self.Prefab.setPosition(e.getLocation());
      }
    });
    tool.on("touchend", function() {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
    });
  },
  //工具图片显示  浇水、除草、种子、镰刀
  imgSrcSelect() {
    var self = this;
    let src_ = "";

    switch (self.Value.toolType) {
      case 1: {
        src_ = "Farm/jiaoshui";
        break;
      }
      case 2: {
        src_ = "Farm/chucao";
        break;
      }
      case 3: {
        src_ = "Farm/zhongzi";
        break;
      }
      case 4: {
        src_ = "Farm/liandao";
        break;
      }
    }
    return src_;
  },
  setBtnState(e) {
    let type = e.currentTarget._name.slice(4);
    this.animate(type);
  },
  //按钮变化
  animate(data) {
    let btnStyle = cc.find("tool/bottomTool/toolBox/btn0" + data, this.node);
    let bt1 = cc.find("tool/bottomTool/toolBox/btn01", this.node);
    let bt2 = cc.find("tool/bottomTool/toolBox/btn02", this.node);
    let bt3 = cc.find("tool/bottomTool/toolBox/btn03", this.node);
    let bt4 = cc.find("tool/bottomTool/toolBox/btn04", this.node);
    console.log();
    if (btnStyle.getPositionY() == 0) {
      this.backanimate([bt1, bt2, bt3, bt4]);
      btnStyle.setScale(1.1);
      btnStyle.setPositionY(15);
      this.Value.toolType = Number(data);
      cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value)); //缓存机制
    } else {
      this.backanimate([bt1, bt2, bt3, bt4]);
      this.Value.toolType = 0;
      cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value)); //缓存机制
    }
    console.log(this.Value.toolType);
  },
  backanimate(e) {
    for (let i = 0; i < e.length; i++) {
      e[i].setScale(1);
      e[i].setPositionY(0);
    }
  },

  update(dt) {
    // this.fatchData();
  }
});
