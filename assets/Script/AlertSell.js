var AlertSell = {
  _Alert: null, //节点
  _animSpeed: 0.3,
  _goodsLabel: null, // 商品名称
  _enterButton: null, // 确定按钮
  _cancelButton: null, // 取消按钮
  _inputNode: null, //输入框节点
  _inputEditBox: null, //输入框
  _moneyLabel: null, //总价
  _price: null, //单价,
  _count: 1, //数量
  _enterCallBack: null //确定按钮回调
};

AlertSell.show = function(name, price, enterCallBack) {
  if (this._Alert != undefined) {
    this._Alert.destroy();
  }
  console.log(this);
  this._price = price;

  //加载预制资源
  cc.loader.loadRes("Prefab/Sell", cc.Prefab, (err, prefab) => {
    //箭头函数 this指向AlertSell
    if (err) {
      cc.error(err);
      return;
    }

    // 实例
    var alert = cc.instantiate(prefab);

    // Alert 持有
    this._Alert = alert;

    // 获取子节点
    this._goodsLabel = cc.find("bg/name", alert).getComponent(cc.Label);
    this._enterButton = cc.find("bg/btn-group/enterButton", alert);
    this._cancelButton = cc.find("bg/btn-group/cancelButton", alert);
    this._inputNode = cc.find("bg/input", alert);
    this._inputEditBox = this._inputNode.getComponent(cc.EditBox);
    this._moneyLabel = cc.find("bg/money/value", alert).getComponent(cc.Label);

    //初始化
    this._goodsLabel.string = name;
    this._moneyLabel.string = price;

    // 添加点击事件
    this._enterButton.on("click", this.onButtonClicked, this);
    this._cancelButton.on("click", this.onButtonClicked, this);
    this._inputNode.on("text-changed", this.onTextChanged, this);

    //将Node添加到父节点中
    this._Alert.parent = cc.find("Canvas");
    // 展现 alert
    this.startFadeIn();
  });

  //进入、弹出动画Action
  this.actionFadeIn = cc.fadeIn(this._animSpeed);
  this.actionFadeOut = cc.sequence(
    cc.fadeOut(this._animSpeed),
    cc.callFunc(() => {
      this._Alert.destroy();
    })
  );

  //************方法
  //按钮点击方法
  AlertSell.onButtonClicked = function() {
    if (event.target.name == "enterButton") {
      if (this._enterCallBack) {
        this._enterCallBack();
      }
    } else {
      this.startFadeOut();
    }
  };
  //editBox 文字改变方法
  AlertSell.onTextChanged = function() {
    this._count = parseInt(this._inputEditBox.string);
    this._moneyLabel.string = this._price * this._count;
  };
  //进入动画
  AlertSell.startFadeIn = function() {
    // cc.eventManager.pauseTarget(Alert._Alert, true);
    // Alert._Alert.position = cc.p(0, 0);
    this._Alert.opacity = 0;
    this._Alert.runAction(this.actionFadeIn);
  };
  // 执行弹出动画
  AlertSell.startFadeOut = function() {
    // cc.eventManager.pauseTarget(Alert._Alert, true);
    this._Alert.runAction(this.actionFadeOut);
  };
};
