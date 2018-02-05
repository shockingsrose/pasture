var func = {
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
  }
};

module.exports = {
  func: func
};
