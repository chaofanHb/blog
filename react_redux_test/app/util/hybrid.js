/**
 * zhixin hybrid
 *
 * 用于抽象native能力调用
 *
 * @authors yanjixiong
 * @date    2016-09-13 16:06:29
 */
//混合模式移动应用
// 闭包执行一个立即定义的匿名函数
!function (factory) {
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    var target = module['exports'] || exports;
    factory(target);
  } else if (typeof define === 'function' && define['amd']) {
    define(['exports'], factory);
  } else {
    factory(window['zhixinHybrid'] = {});
  }
}(function (zhixinExports) {
  // ko的全局定义 koExports是undefined 对应着上面的[3] 这种情况
  var zhixinHybrid = typeof zhixinExports !== 'undefined' ? zhixinExports : {};
  console.log(zhixinExports);
  // 版本号
  zhixinHybrid.version = '1.0.3';
  // 清空上次localStorage内存储的数据
  localStorage.clear();
  // prepared标识安卓 IOS 客户端是否准备好JS能力接口，若未准备好则不允许访问JS能力
  localStorage.prepared = false;
  zhixinHybrid.isAvailable = function isAvailable(tagName) {
    if (!tagName) {
      return false;
    }
    return localStorage.prepared && window.zhixin && window.zhixin[tagName] && typeof window.zhixin[tagName] === 'function';
  };
  zhixinHybrid.requestHybridToZHIXIN = function requestHybridToZHIXIN(params) {
    if (!localStorage.prepared) {
      console.log('客户端未加载完成，请稍后再试！');
      return;
    }
    if (!params.tagname) {
      console.log('必须包含tagname');
      return;
    }
    //生成唯一执行函数，执行后销毁
    var tagname = params.tagname.substr(0, params.tagname.indexOf('('));
    //处理有回调的情况
    if (params.callback) {
      if (!typeof params.callback === 'function') {
        //不存在或不是function
        console.error('回调函数不是一个function');
        return;
      }
      //生成一个随机不重复的方法名
      var _random_tagname = tagname + "_" + RandomTagName();
      
      //缓存方法
      // saveFns(_random_tagname, params.callback);
      
      // 去除注释
      var reg = /([^:]\/{2,}.*?(\r|\n))/g;
      var callbackStr = params.callback.toString().replace(reg, '').replace(/\n/g, '');
      
      localStorage.setItem(_random_tagname, callbackStr);
      var _callbackFun = _random_tagname;
      params.callback = tagname;
      zhixinHybrid._addHybridParamWiThCallBack(tagname, params, _callbackFun);
    } else {
      zhixinHybrid._addHybridParam(tagname, params);
    }
  };
  zhixinHybrid._addHybridParam = function _addHybridParam(tag, params, callback) {
    var tagname = params.tagname;
    var re = /\([^\)]+\)/g;
    var attrs = tagname.match(re);
    if (!attrs) {
      return zhixinHybrid._request(tag);
    }
    attrs = attrs[0];
    attrs = attrs.substring(1, attrs.length - 1).split(',');
    //有参数传递
    if (attrs.length > 0) {
      if (!params.param) {
        console.log('当前方法需要传递参数！');
        return;
      } else {
        var key, counter = 0;
        for (key in params.param) counter++;
        if (attrs.length != counter) {
          console.log('当前方法需要传递参数个数与实际传入的个数不符！');
          return;
        }
      }
    }
    if (attrs.length == 1) {
      return zhixinHybrid._request(tag, params.param[attrs[0]]);
    } else if (attrs.length == 2) {
      return zhixinHybrid._request(tag, params.param[attrs[0]], params.param[attrs[1]]);
    } else {
      console.error('投递参数不合法！');
      return;
    }
  };
  zhixinHybrid._addHybridParamWiThCallBack = function _addHybridParamWiThCallBack(tag, params, callback) {
    var tagname = params.tagname;
    var re = /\([^\)]+\)/g;
    var attrs = tagname.match(re);
    if (!attrs) {
      return zhixinHybrid._requestWithCallBack(tag, callback);
    }
    attrs = attrs[0];
    attrs = attrs.substring(1, attrs.length - 1).split(',');
    //有参数传递
    if (attrs.length > 0) {
      if (!params.param) {
        console.error('当前方法需要传递参数！');
        return;
      } else {
        var key, counter = 0;
        for (key in params.param) counter++;
        if (attrs.length != counter) {
          console.error('当前方法需要传递参数个数与实际传入的个数不符！');
          return;
        }
      }
    }
    if (attrs.length == 1) {
      return zhixinHybrid._requestWithCallBack(tag, callback, params.param[attrs[0]]);
    } else if (attrs.length == 2) {
      return zhixinHybrid._requestWithCallBack(tag, callback, params.param[attrs[0]], params.param[attrs[1]]);
    } else {
      console.error('投递参数不合法！');
      return;
    }
  };
  zhixinHybrid._requestWithCallBack = function _requestWithCallBack(tagname, callback, param1, param2) {
    if (!param1 && !param2) {
      window.zhixin[tagname](callback);
    }
    if (param1 && !param2) {
      window.zhixin[tagname](callback, param1);
    }
    if (param1 && param2) {
      window.zhixin[tagname](callback, param1, param2);
    }
  };
  zhixinHybrid._request = function zhixinHybrid(tagname, param1, param2) {
    if (!param1 && !param2) {
      window.zhixin[tagname]();
    }
    if (param1 && !param2) {
      console.log('222222');
      console.log(window.zhixin);
      window.zhixin[tagname](param1);
    }
    if (param1 && param2) {
      window.zhixin[tagname](param1, param2);
    }
  };
  /**
   * 安卓 IOS 准备好JS能力接口时调用此方法
   */
  window.onZhiXinLoad = function () {
    console.log('Android or IOS has already prepared.');
    localStorage.prepared = true;
    // 提供钩子机制
    window.afterZhiXinLoad && window.afterZhiXinLoad();
  };
  /**
   * 生成唯一方法名
   * @returns {string}
   */
  window.RandomTagName = function () {
    var str = "abcdefghijklmnopqrstuvwxyz";
    var n = 5, s = "";
    for (var i = 0; i < n; i++) {
      var rand = Math.floor(Math.random() * str.length);
      s += str.charAt(rand);
    }
    var time = new Date().getTime();
    return s + "_" + time;
  };
  /**
   * 存储方法操作
   * @param tagName
   * @param fns
   */
  // window.saveFns = function (tagName, fns) {
  //   alert('接收方法:' + tagName);
  //   window[tagName] = function (result) {
  //     // alert('call');
  //     // // 执行回调
  //     fns(result);
  //     // setTimeout(function() {
  //     //   tmpFn[tagName] = null;
  //     // }, 100);
  //   }
  // };
  /**
   * 中转方法，用于在js环境中对最终方法进行调用
   * @param  {[type]} result [description]
   * @return {[type]}        [description]
   */
  window.callbackExec = function(result) {
    console.log('中转方法:' + typeof result);
    // onZhiXinLoad方法是在初始化时注册的，直接调用，
    // 而动态绑定的方法是存储在localStorage中，需要取出再执行
    if (result.callback === 'onZhiXinLoad') {
      window.onZhiXinLoad();
      return;
    }
    var callbackStr = localStorage.getItem(result.callback);
    console.log('callbackStr:' + callbackStr);
    console.log('localStorage length:' + localStorage.length);
    
    try {
      var finalFuncStr = '(' + callbackStr + ')(' + JSON.stringify(result) + ')';
      console.log('exec: ' + finalFuncStr);
      var callbackFunc = eval(finalFuncStr);
      // console.log('callbackFunc:' + callbackFunc);
      // callbackFunc(result);
    } catch(e) {
      alert('回调函数错误:' + e.message);
    }
  }
  // Native端执行静态方法，用于将回调结果传递到js环境中
  window.callback = function(result) {
    console.log('返回结果:' + JSON.stringify(result));
    if (result && result.callback) {
      window.callbackExec(result);
    } else {
      console.log('callback not found');
    }
  }
  window.test = 1;
  /**
   * 临时缓存回调方法
   *
   * 这里存储是已key / value 的形式存储
   * key        为随机生成的方法名字
   * value    为function可执行的方法
   */
  window.tmpFn = {};
  window.bindTime = new Date().toString();
  window.onerror = function(err, url, num) {
    console.log('第' + num + '行\n' + err + '\n bindTime:' + window.bindTime);
  }
  return zhixinHybrid;
});