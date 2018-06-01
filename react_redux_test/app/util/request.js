/**
 * request util
 * @authors yanjixiong
 * @date    2017-03-22 16:13:58
 */

var Promise = require('promise');
var request = require('superagent-promise')(require('superagent'), Promise);
var api = require('../constants/api');

exports.post = function post(url, body) {
  return request.post(`${api.PREFIX}${url}`)
    .send(body)
    .then(function postDone(res) {
      return Promise.resolve(res);
    });
}

exports.get = function get(url) {
  return request.get(`${api.PREFIX}${url}`)
    .then(function postDone(res) {
      return Promise.resolve(res);
    });
}
