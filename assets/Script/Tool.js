var Tool = {};

Tool.setBarColor = function(bar, value) {
  var Node = bar;
  if (value < 0.6) {
    Node.color = cc.color("#FF4A4A");
  } else if (value < 0.8) {
    Node.color = cc.color("#FFB70B");
  } else {
    Node.color = cc.color("#74DA72");
  }
};

Tool.closeModal = function(node) {
  var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(node.removeFromParent, node));
  node.runAction(action);
};

Tool.once = function(fn) {
  var result;
  return function() {
    if (fn) {
      result = fn.apply(this, arguments);
      fn = null;
    }
    return result;
  };
};
