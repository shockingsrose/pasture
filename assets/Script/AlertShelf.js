var Alertshelf = {
  _Alert: null, //节点
  _animSpeed: 0.3,
  _goodsLabel: null, // 商品名称
  _enterButton: null, // 确定按钮
  _cancelButton: null, // 取消按钮
  _inputCountNode: null, //数量输入框节点
  _inputPriceNode: null, //价格输入框节点
  _inputCountEditBox: null, //数量输入框
  _inputPriceEditBox: null, //价格输入框
  _moneyLabel: null, //总价
  _price: null, //单价,
  _count: 1, //数量
  _enterCallBack: null, //确定按钮回调
  show: function(name, enterCallBack) {
    if (this._Alert != undefined) {
      this._Alert.destroy();
    }
    console.log(this);

    this._enterCallBack = enterCallBack || null;

    //加载预制资源
    cc.loader.loadRes("Prefab/Shelf", cc.Prefab, (err, prefab) => {
      //箭头函数 this指向Alertshelf
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
      this._inputCountNode = cc.find("bg/input-count", alert);
      this._inputCountEditBox = this._inputCountNode.getComponent(cc.EditBox);
      this._inputPriceNode = cc.find("bg/input-price", alert);
      this._inputPriceEditBox = this._inputPriceNode.getComponent(cc.EditBox);
      this._moneyLabel = cc.find("bg/money/value", alert).getComponent(cc.Label);

      //初始化
      this._goodsLabel.string = name;
      this._moneyLabel.string = 0;

      // 添加点击事件
      this._enterButton.on("click", this.onButtonClicked, this);
      this._cancelButton.on("click", this.onButtonClicked, this);
      this._inputCountNode.on("text-changed", this.onTextChanged, this);
      this._inputPriceNode.on("text-changed", this.onTextChanged, this);

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
    Alertshelf.onButtonClicked = function(event) {
      if (event.target.name == "enterButton") {
        if (this._enterCallBack) {
          this._enterCallBack();
        }
      }
      this.startFadeOut();
    };
    //editBox 文字改变方法
    Alertshelf.onTextChanged = function() {
      this._count = parseInt(this._inputCountEditBox.string) || 0;
      this._price = parseInt(this._inputPriceEditBox.string) || 0;
      this._moneyLabel.string = this._price * this._count;
    };
    //进入动画
    Alertshelf.startFadeIn = function() {
      // cc.eventManager.pauseTarget(Alert._Alert, true);
      // Alert._Alert.position = cc.p(0, 0);
      this._Alert.opacity = 0;
      this._Alert.runAction(this.actionFadeIn);
    };
    // 执行弹出动画
    Alertshelf.startFadeOut = function() {
      // cc.eventManager.pauseTarget(Alert._Alert, true);
      this._Alert.runAction(this.actionFadeOut);
    };
  }
};

module.exports = {
  Alertshelf: Alertshelf
};
