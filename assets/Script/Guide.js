var GuideSystem = {
  step: 0,
  scene: null,
  guide() {
    this.scene = cc.find("Canvas");
    cc.loader.loadRes("Prefab/guide", cc.Prefab, (err, prefab) => {
      if (err) {
        console.log(err);
        return;
      }
      let oldGuideNode = cc.find("guide", this.scene);
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      let guideNode = cc.instantiate(prefab);
      let guideMaskNode = cc.find("mask-guide", guideNode);
      let modalSprite = cc.find("modal", guideMaskNode).getComponent(cc.Sprite);
      let circleNode = cc.find("circle", guideMaskNode);
      switch (this.step) {
        case 0:
          this.guideStep0(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 1:
          this.guideStep1(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 2:
          this.guideStep2(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 3:
          this.guideStep3(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 4:
          this.guideStep4(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 5:
          this.guideStep5(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 6:
          this.guideStep6(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 7:
          this.guideStep7(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 8:
          this.guideStep8(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
      }
      this.step++;
      this.scene.addChild(guideNode, 99);
    });
  },
  guideStep0(guideNode, guideMaskNode, modalSprite, circleNode) {
    cc.loader.loadRes("guide/pic", cc.SpriteFrame, (err, spriteFrame) => {
      modalSprite.spriteFrame = spriteFrame;
    });
    circleNode.active = false;

    guideNode.on("click", this.guide, this);
  },
  guideStep1(guideNode, guideMaskNode, modalSprite, circleNode) {
    this.sceneJS = this.scene.getComponent("Index");
    //设置position
    let btnMoreNode = cc.find("div_menu/more", this.scene);
    let pos = btnMoreNode.getPosition();
    //将节点坐标转换成世界坐标系（左下角为原点）
    // let pos_3 = this.btnMoreNode.convertToWorldSpace(pos);
    // let pos_4 = this.btnMoreNode.getNodeToWorldTransform(pos);
    let pos_5 = btnMoreNode.getNodeToWorldTransformAR(pos);
    let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    let height = btnMoreNode.height;
    let width = btnMoreNode.width;
    let radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;

    cc.loader.loadRes("guide/pic-1", cc.SpriteFrame, (err, spriteFrame) => {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.once(
      "click",
      () => {
        this.sceneJS.func.showMenu.call(this.sceneJS).then(() => {
          this.guide();
        });
      },
      this
    );
  },
  guideStep2(guideNode, guideMaskNode, modalSprite, circleNode) {
    let shopNode = cc.find("div_menu/Menu/MenuList/menuScroll/view/content/shop", this.scene);

    //设置position
    let pos = shopNode.getPosition();
    let pos_5 = shopNode.getNodeToWorldTransformAR(pos);
    let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    let height = shopNode.height;
    let width = shopNode.width;
    let radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes("guide/pic-2", cc.SpriteFrame, (err, spriteFrame) => {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on("click", this.sceneJS.func.loadSceneShop, this);
  },
  guideStep3(guideNode, guideMaskNode, modalSprite, circleNode) {
    let goodsNode = cc.find("bg/PageView/view/content/page_0/goodsList/goods", this.scene);

    //设置position
    let pos = goodsNode.getPosition();
    let pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    let height = goodsNode.height;
    let width = goodsNode.width;
    let radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes("guide/pic-3-0", cc.SpriteFrame, (err, spriteFrame) => {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on(
      "click",
      () => {
        goodsNode.emit("maskClick");
        this.guide();
      },
      this
    );
  },
  //确定购买
  guideStep4(guideNode, guideMaskNode, modalSprite, circleNode) {
    modalSprite.node.active = false;
    circleNode = cc.find("circle", guideMaskNode);
    circleNode.active = false;
    setTimeout(() => {
      let SellNode = cc.find("Sell", this.scene);
      let enterButton = cc.find("bg/btn-group/enterButton", SellNode);
      //设置position
      let pos = enterButton.getPosition();
      let pos_5 = enterButton.getNodeToWorldTransformAR(pos);
      let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      let height = enterButton.height;
      let width = enterButton.width;

      guideMaskNode.height = width;
      guideMaskNode.width = width;
      let ModalNode = cc.find("Modal", SellNode);
      let ModalSprite = ModalNode.getComponent(cc.Sprite);
      ModalNode.opacity = 255;
      ModalNode.color = cc.color("#ffffff");
      cc.loader.loadRes("guide/pic-3", cc.SpriteFrame, (err, spriteFrame) => {
        ModalSprite.spriteFrame = spriteFrame;
      });

      guideMaskNode.on("click", () => {
        //买一个蛋
        this.PostBuy(8, 1).then(data => {
          if (data.Code === 1) {
            Msg.show("购买成功");
            setTimeout(function() {
              cc.director.loadScene("index", this.guide);
            }, 1000);
          } else {
            Msg.show(data.Message);
          }
        });
      });
    }, 500);
  },
  //点击仓库
  guideStep5(guideNode, guideMaskNode, modalSprite, circleNode) {
    this.sceneJS = this.scene.getComponent("Index");
    this.sceneJS.func.showMenu.call(this.sceneJS).then(() => {
      let repertoryNode = cc.find("div_menu/Menu/MenuList/menuScroll/view/content/repertory", this.scene);

      //设置position
      let pos = repertoryNode.getPosition();
      let pos_5 = repertoryNode.getNodeToWorldTransformAR(pos);
      let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      let height = repertoryNode.height;
      let width = repertoryNode.width;
      let radius = height > width ? height : width;
      guideMaskNode.height = radius + 15;
      guideMaskNode.width = radius + 15;
      cc.loader.loadRes("guide/pic-4", cc.SpriteFrame, (err, spriteFrame) => {
        modalSprite.spriteFrame = spriteFrame;
      });
      //绑定事件
      guideMaskNode.on("click", this.sceneJS.func.loadSceneRepertory, this);
    });
  },
  //点击小鸡
  guideStep6(guideNode, guideMaskNode, modalSprite, circleNode) {
    setTimeout(() => {
      this.sceneJS = this.scene.getComponent("Repertory");
      let itemNode = cc.find("bg/bg-f3/PageView/view/content/page_1/goodsList/item", this.scene);
      //设置position
      let pos = itemNode.getPosition();
      let pos_5 = itemNode.getNodeToWorldTransformAR(pos);
      let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);
      // 设置mask宽度和高度
      let height = itemNode.height;
      let width = itemNode.width;
      let radius = height > width ? height : width;
      guideMaskNode.height = radius + 15;
      guideMaskNode.width = radius + 15;
      cc.loader.loadRes("guide/pic-5", cc.SpriteFrame, (err, spriteFrame) => {
        modalSprite.spriteFrame = spriteFrame;
      });
      //绑定事件
      guideMaskNode.on(
        "click",
        () => {
          itemNode.emit("maskClick");
          this.guide();
        },
        this
      );
    }, 500);
  },
  //孵化小鸡
  guideStep7(guideNode, guideMaskNode, modalSprite, circleNode) {
    modalSprite.node.active = false;
    let guideMask = guideMaskNode.getComponent(cc.Mask);
    guideMask.type = 0;
    circleNode = cc.find("circle", guideMaskNode);
    circleNode.active = false;
    setTimeout(() => {
      let enterButton = cc.find("modal/div/btn-group/btn-red", this.scene);

      //设置position
      let pos = enterButton.getPosition();
      let pos_5 = enterButton.getNodeToWorldTransformAR(pos);
      let pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      let height = enterButton.height;
      let width = enterButton.width;

      guideMaskNode.height = height;
      guideMaskNode.width = width;

      let ModalNode = cc.find("modal/bg", this.scene);
      let ModalSprite = ModalNode.getComponent(cc.Sprite);
      ModalNode.opacity = 255;
      ModalNode.color = cc.color("#ffffff");

      cc.loader.loadRes("guide/pic-6", cc.SpriteFrame, (err, spriteFrame) => {
        ModalSprite.spriteFrame = spriteFrame;
      });

      guideMaskNode.on("click", () => {
        enterButton.emit("maskClick");
      });
    }, 500);
  },
  //朕已阅
  guideStep8(guideNode, guideMaskNode, modalSprite, circleNode) {
    let guideMask = guideMaskNode.getComponent(cc.Mask);
    guideMask.type = 0;
    let button = cc.find("btn", guideNode);
    button.active = true;
    // circleNode = cc.find("circle", guideMaskNode);
    // circleNode.active = false;

    cc.loader.loadRes("guide/pic-7", cc.SpriteFrame, (err, spriteFrame) => {
      modalSprite.spriteFrame = spriteFrame;
    });

    button.on("click", () => {
      Config.firstLogin = false;
      guideNode.removeFromParent();
      Msg.show("恭喜你，完成了新手指引！");
    });
  },

  PostBuy(prId, count) {
    count = count || 1;
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("购买成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("购买失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_Property/PostBuy", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + Config.openID + "&count=" + count + "&prId=" + prId);
    });
  }
};

// var GuideSystem = (function() {
//   var _step = 0;
//   var guide = function(){
//     cc.loader.loadRes("Prefab/guide", cc.Prefab, (err, prefab) => {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         let oldGuideNode = cc.find("guide", this.node);
//         oldGuideNode ? oldGuideNode.removeFromParent() : false;
//         let guideNode = cc.instantiate(prefab);
//         let guideMaskNode = cc.find("mask-guide", guideNode);
//         let modalSprite = cc.find("modal", guideMaskNode).getComponent(cc.Sprite);
//         let circleNode = cc.find("circle", guideMaskNode);
//         switch (this.step) {
//           case 0:
//             this.guideStep0(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//           case 1:
//             this.guideStep1(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//           case 2:
//             this.guideStep2(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//         }
//         this.step++;
//         this.node.addChild(guideNode, 99);
//       });
//   }
// })();
