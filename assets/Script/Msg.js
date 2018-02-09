"use strict";

var Msg = {
  _text: null,
  _timer: null,
  _animSpeed: 0.3,
  _timeout: 2000
};

Msg.show = function(text, animSpeed, timeout) {
  var _this = this;

  this._animSpeed = animSpeed ? animSpeed : this._animSpeed;
  this._timeout = timeout ? timeout : this._timeout;
  cc.loader.loadRes("Prefab/Msg", cc.Prefab, function(err, Prefab) {
    var msgNode = cc.instantiate(Prefab);
    var msgLabel = cc.find("message", msgNode).getComponent(cc.Label);
    msgLabel.string = text;
    var parentNode = cc.find("Canvas");
    parentNode.addChild(msgNode, 5);

    msgNode.opacity = 0;
    msgNode.runAction(cc.fadeIn(_this._animSpeed));
    //2秒后移除

    var action = cc.sequence(
      cc.fadeOut(_this._animSpeed),
      cc.callFunc(function() {
        msgNode.destroy();
      }, _this)
    );
    setTimeout(function() {
      console.log("20s");
      msgNode.runAction(action);
    }, _this._timeout);
  });
};
