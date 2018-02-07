var func = {
  //获取所有数据（index页面）
  openID: "o9AgowGKcD5MAuYIhedEX-4aHpJc",
  GetWholeData() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("成功获取数据");
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", "http://192.168.42.88:4633/T_Base_User/GetWholeData?openID=o9AgowGKcD5MAuYIhedEX-4aHpJc", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://192.168.42.88:4633/T_Base_User/POSTWholeData", true);
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      // xhr.send("openID=o9AgowGKcD5MAuYIhedEX&pageSize=9");
    });
  },
  //获取好友列表
  GetFriendsList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("成功获取数据");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        "http://192.168.42.88:4633/T_Base_User/GetFriendsList?openID=o9AgowGKcD5MAuYIhedEX-4aHpJc&startIndex=1&endIndex=9&orderby=Grade desc",
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://192.168.42.88:4633/T_Base_User/POSTWholeData", true);
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      // xhr.send("openID=o9AgowGKcD5MAuYIhedEX&pageSize=9");
    });
  },

  //签到接口
  //[HttpPost]
  //T_Base_SignFlow/PostSign(string openId)
  PostSign() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("签到成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", "http://192.168.42.88:4633/T_Base_SignFlow/PostSign", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=o9AgowGKcD5MAuYIhedEX-4aHpJc");
    });
  },
  //小鸡清理
  /// <summary>
  /// 牧场清理
  /// </summary>
  /// <param name="openId">需要清理的用户openid</param>
  /// <param name="type">1.清理自己的牧场，2.清理好友的牧场</param>
  /// <param name="openIds">好友openid</param>
  //         [HttpPost]
  //         public JsonResult PostClean(string openId, int type = 1, string openIds = "")

  // 返回 CODE 1 成功， 0 失败, 000数据为空
  PostClean() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("清理成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", "http://192.168.42.88:4633/T_Ranch_Clean/PostClean", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=o9AgowGKcD5MAuYIhedEX-4aHpJc&type=1");
    });
  },
  PostTreat() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", "http://192.168.42.88:4633/T_Chicken_Treatment/POSTOneTreatment", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("id=1");
    });
  },
  PostOwnFeeds() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("喂食成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("喂食失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", "http://192.168.42.88:4633/T_Chicken_Feed/POSTOwnFeeds", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("id=1");
    });
  },
  //获取小鸡当前的健康值及饥饿度
  GetChickValue() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("清理成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", "http://192.168.42.88:4633/T_Base_Chicken/GetModelValue", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cid=1");
    });
  },
  //获得当月签到的记录数组
  GetSignList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("GET", "http://192.168.42.88:4633/T_Base_SignFlow/GetList?openId=o9AgowGKcD5MAuYIhedEX-4aHpJc", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得商城的商品
  GetGoodList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取商城数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", "http://192.168.42.88:4633/T_Base_Property/GetListByPage?page=1", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //购买商品接口
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
      xhr.open("POST", "http://192.168.42.88:4633/T_Base_Property/PostBuy", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=o9AgowGKcD5MAuYIhedEX-4aHpJc&count=" + count + "&prId=" + prId);
    });
  },
  //获得仓库列表
  GetRepertoryList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取仓库数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        "http://192.168.42.88:4633/T_Base_Warehouse/GetListByPage?openId=" + this.openID + "&page=1",
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  }
};

module.exports = {
  func: func
};
