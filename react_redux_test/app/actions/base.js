/**
 * base action
 * @authors yanjixiong
 * @date    2017-03-22 18:20:12
 */

var types = require('../constants');
var request = require('../util/request');

module.exports = {
  /**
   * 用户信息
   * @return {[type]} [description]
   */
  info: function() {
    return request.get('/info')
      .then(function onResult(res) {
        return {type: types.BASE_INFO, info: res.body};
      });
  },
}
