var Tool = {};

Tool.setBarColor = function(bar, value) {
  let Node = bar;
  if (value < 0.6) {
    Node.color = cc.color("#FF4A4A");
  } else if (value < 0.8) {
    Node.color = cc.color("#FFB70B");
  } else {
    Node.color = cc.color("#74DA72");
  }
};
