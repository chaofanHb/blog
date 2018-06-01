/**
 * base reducer
 * @authors yanjixiong
 * @date    2017-03-22 18:16:00
 */

var types = require('../constants');

module.exports = function constants(state, action) {
  var oldState = !state 
    ? {
      info: {}, // 当前用户信息
    } 
    : state;

  switch (action.type) {
  case types.BASE_INFO:
    return Object.assign({}, oldState, {
      info: action.info,
    });
  default:
    return oldState;
  }
}
