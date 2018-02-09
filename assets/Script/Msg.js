var Msg = {
  _text: null,
  _timer: null,
  _animSpeed: 0.3,
  _timeout: 2000
};

Msg.show = function(text, animSpeed, timeout) {
  this._animSpeed = animSpeed ? animSpeed : this._animSpeed;
  this._timeout = timeout ? timeout : this._timeout;
  cc.loader.loadRes("Prefab/Msg", cc.Prefab, (err, Prefab) => {
    let msgNode = cc.instantiate(Prefab);
    let msgLabel = cc.find("message", msgNode).getComponent(cc.Label);
    msgLabel.string = text;
    var parentNode = cc.find("Canvas");
    parentNode.addChild(msgNode, 5);

    msgNode.opacity = 0;
    msgNode.runAction(cc.fadeIn(this._animSpeed));
    //2秒后移除

    let action = cc.sequence(
      cc.fadeOut(this._animSpeed),
      cc.callFunc(() => {
        msgNode.destroy();
      }, this)
    );
    setTimeout(() => {
      console.log("20s");
      msgNode.runAction(action);
    }, this._timeout);
  });
};
