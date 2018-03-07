"use strict";

var Msg = {
  _text: null,
  _timer: null,
  _animSpeed: 0.3,
  _timeout: 2000,
  MsgNode: null
};

Msg.show = function(text, animSpeed, timeout) {
  var _this = this;
  if (_this.MsgNode != undefined) {
    _this.MsgNode.removeFromParent();
    _this.MsgNode.destroy();

    clearTimeout(_this._timer);
  }

  this._animSpeed = animSpeed ? animSpeed : this._animSpeed;
  this._timeout = timeout ? timeout : this._timeout;
  cc.loader.loadRes("Prefab/Msg", cc.Prefab, function(err, Prefab) {
    _this.MsgNode = cc.instantiate(Prefab);
    var msgLabel = cc.find("message", _this.MsgNode).getComponent(cc.Label);
    msgLabel.string = text;
    var parentNode = cc.find("Canvas");
    parentNode.addChild(_this.MsgNode, 5);

    _this.MsgNode.opacity = 0;
    _this.MsgNode.runAction(cc.fadeIn(_this._animSpeed));
    //2秒后移除
    clearTimeout(_this._timer);
    clearTimeout(_this._timer);
    var action = cc.sequence(
      cc.fadeOut(_this._animSpeed),
      cc.callFunc(function() {
        _this.MsgNode.destroy();
      }, _this)
    );
    _this._timer = setTimeout(function() {
      _this.MsgNode.runAction(action);
    }, _this._timeout);
  });
};
