var func = {
  //获取所有数据（index页面）
  openID: null,
  GetWholeData() {
    // Loading.show();
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
            response = JSON.parse(response);

            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", "http://www.jingongbao.com:4633/T_Base_User/GetWholeData?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_User/POSTWholeData", true);
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
        "http://www.jingongbao.com:4633/T_Base_User/GetFriendsList?openID=" +
          this.openID +
          "&startIndex=1&endIndex=9&orderby=Grade desc",
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_User/POSTWholeData", true);
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      // xhr.send("openID=o9AgowGKcD5MAuYIhedEX&pageSize=9");
    });
  },

  //通过Id获取小鸡当前的健康值及饥饿度
  GetChickValueById(Id) {
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
      // POST方法1
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_Chicken/GetModelValue", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cid=" + Id);
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
      // Get方法
      xhr.open("GET", "http://www.jingongbao.com:4633/T_Base_SignFlow/GetList?openId=" + this.openID, true);
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
      xhr.open("GET", "http://www.jingongbao.com:4633/T_Base_Property/GetListByPage?page=1", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得仓库列表
  GetRepertoryList() {
    // Loading.show();
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
        "http://www.jingongbao.com:4633/T_Base_Warehouse/GetListByPage?openId=" + this.openID + "&page=1",
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //签到接口
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_SignFlow/PostSign", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //牧场清理 type=1 自己清理
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Ranch_Clean/PostClean", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&type=1");
    });
  },
  //小鸡治疗
  PostTreat(Id) {
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Chicken_Treatment/POSTOneTreatment", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("id=" + Id);
    });
  },
  //小鸡喂食
  PostOwnFeeds(Id) {
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Chicken_Feed/POSTOwnFeeds", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("id=" + Id);
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_Property/PostBuy", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&count=" + count + "&prId=" + prId);
    });
  },

  //孵化小鸡
  HatchEgg() {
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Chicken_Egg/EggHatch", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //收取鸡蛋
  CollectEgg() {
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
            console.log("获取鸡蛋失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_User/CollectEgg", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //填充饲料槽接口
  AddFeed() {
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_Ranch/AddFeed", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //获得饲料槽信息
  GetFeedData() {
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
      // GET方法
      xhr.open("GET", "http://www.jingongbao.com:4633/T_Base_Ranch/GetModel?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得该用户的鸡的列表
  GetChickList() {
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
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_Chicken/GetModelList", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //通过Id找到鸡对象（状态及相应的值）
  GetChickById(Id) {
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
      // POST方法1
      xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_Chicken/ChickenAndRanch", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cid=" + Id);
    });
  },
  //获取用户中心数据
  GetUserData(pageIndex, pageSize) {
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
            response = JSON.parse(response);

            reject(response);
          }
        }
      };
      // POST方法

      xhr.open(
        "POST",
        "http://www.jingongbao.com:4633/T_Base_User/PersonalCore?openId=" +
          this.openID +
          "&page=" +
          pageIndex +
          "&pagesize=" +
          pageSize,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  }
};

module.exports = {
  func: func
};
