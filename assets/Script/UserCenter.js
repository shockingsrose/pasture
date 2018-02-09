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
cc.Class({
  extends: cc.Component,

  properties: {
    RepertoryByCenter_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },

  btnBackEvent() {
    cc.director.loadScene("index");
  },

  //获取用户参数
  setData(data) {
    var model = JSON.parse(data);
    if (model.Code == 1) {
      console.log(model);
      var userName = cc.find("scrollview/view/layout/info/nameEdit/label", this.node);
      var ExperienceValue = cc.find("scrollview/view/layout/info/level/progressBar", this.node);
      var ExperienceValueNumber = cc.find("scrollview/view/layout/info/level/label2", this.node);
      var RanchMoney = cc.find("scrollview/view/layout/myAssets/box/flex-right/value", this.node);
      var PointValue = cc.find("scrollview/view/layout/myAssets/box2/flex-right/value", this.node);

      userName.getComponent(cc.Label).string = model.UserModel.RealName;
      ExperienceValue.getComponent(cc.ProgressBar).progress = model.UserModel.ExperienceValue * 5 / 500;
      ExperienceValueNumber.getComponent(cc.Label).string = model.UserModel.ExperienceValue + "/100";
      RanchMoney.getComponent(cc.Label).string = model.UserModel.RanchMoney;
      PointValue.getComponent(cc.Label).string = model.UserModel.Point;
    } else {
      console.log(model.Message);
    }
  },
  //获取仓库数据  类型 1.系统鸡蛋. 2.不可以孵化的蛋 3.贵妃鸡， 4.饲料，5.成长加速剂
  setRepertory(data) {
    console.log(data);
    if (data.Code == 1) {
      for (let i = 0; i < data.List.length; i++) {
        // data.List[i].Type;
        const RepertoryByCenter = cc.instantiate(this.RepertoryByCenter_Prefab);
        const PrefabParent = cc.find("scrollview/view/layout/myAssets/pageview/view/content", this.node);
        const Count = cc.find("label", RepertoryByCenter);
        let updateBg = cc.find("item01", RepertoryByCenter).getComponent(cc.Sprite);
        let updateCount = cc.find("label", RepertoryByCenter).getComponent(cc.Label);
        let imgSrc;
        switch (data.List[i].Type) {
          case 1: {
            imgSrc = "Modal/Repertory/img-hatchEgg";
            break;
          }
          case 2: {
            imgSrc = "Modal/Repertory/img-egg";
            break;
          }
          case 3: {
            imgSrc = "Modal/Repertory/img-hen";
            break;
          }
          case 4: {
            imgSrc = "Modal/Repertory/feed";
            break;
          }
          case 5: {
            imgSrc = "Modal/Repertory/img-hen";
            break;
          }
        }

        cc.loader.loadRes(imgSrc, cc.SpriteFrame, function(err, spriteFrame) {
          updateBg.spriteFrame = spriteFrame;
        });

        updateCount.string = "×" + data.List[i].Count;
        data.List[i].Count == 0 ? (RepertoryByCenter.active = false) : (RepertoryByCenter.active = true);

        PrefabParent.addChild(RepertoryByCenter);
      }
    } else {
      console.log(model.Message);
    }
  },
  onLoad() {
    Data.func.GetWholeData().then(data => {
      this.setData(data);
    });
    Data.func.GetRepertoryList().then(data => {
      this.setRepertory(data);
    });
  },
  start() {}

  // update (dt) {},
});
