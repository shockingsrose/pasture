// cc.Class({
//   extends: cc.Component,

//   properties: {
//     loading_Prefab: {
//       default: null,
//       type: cc.Prefab
//     }
//   },

//   loadNode: null,
//   LoadFunc: null,
//   show() {
//     this.loadNode.active = true;
//   },
//   hide() {
//     this.loadNode.active = false;
//   },
//   onLoad() {
//     this.loadNode = cc.instantiate(loading_Prefab);
//     this.loadNode.parent = cc.find("Canvas");
//     this.LoadFunc = {
//       show: this.show,
//       hide: this.hide
//     };
//   },

//   start() {}

//   // update (dt) {},
// });

"use strict";

var Loading = {
  loadNode: null,
  loadEnd: false,
  show: function show() {
    return new Promise(function(resolve, reject) {
      cc.loader.loadRes("Prefab/loading", cc.Prefab, function(error, prefab) {
        if (error) {
          reject(error);
        }
        if (!this.loadNode) {
          this.loadNode = cc.instantiate(prefab);
          var parentNode = cc.find("Canvas");
          parentNode.addChild(this.loadNode);
        }
        resolve(this.loadNode);
      });
    });
  },
  hide: function hide() {
    this.show().then(function(data) {
      if (data) {
        data.destroy();
      }
    });
  },
  init: function init() {
    cc.loader.loadRes("Prefab/loading", cc.Prefab, function(error, prefab) {
      if (error) {
        cc.error(error);
        return;
      }
      this.loadNode = cc.instantiate(prefab);
    });
  }
};
