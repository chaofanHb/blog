/**
 * select actions
 * @authors yanjixiong
 * @date    2017-02-14 09:23:31
 */

/**
 * contacts action
 * @authors yanjixiong
 * @date    2016-07-11 08:58:29
 */

var request = require('../util/request');
var types = require('../constants');

module.exports = {
  /**
   * 跳到的节点对象
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  treeForward: function(node) {
    return { type: types.SELECT_TREE_FORWARD, node: node };
  },

  /**
   * 回退到上一级节点
   * @return {[type]}       [description]
   */
  treeBack: function() {
    return { type: types.SELECT_TREE_BACK };
  },

  /**
   * 搜索
   * @param  {[type]} keyword [description]
   * @return {[type]}         [description]
   */
  search: function(keyword, domain) {
    var action = { type: types.SELECT_SEARCH};
    var body = {
      domain: domain,
      name: keyword,
    }
    return request.post('/address/searchPerson', body)
      .then(function newState(res) {
        action.contactsList = res.body.data || [];
        return action;
      });
  },

  /**
   * 改变关键词
   * @param  {[type]} keyword [description]
   * @return {[type]}         [description]
   */
  keywordChange: function(keyword) {
    return { type: types.SELECT_KEYWORD, keyword: keyword };
  },

  /**
   * 初始化列表数据
   * @return {[type]} [description]
   */
  init: function(domain) {
    var body = {
      domain: domain,
    }
    return request.post('/address/init', body)
      .then(function onResult(res) {
        return {type: types.SELECT_INIT, contactsList: res.body.data || []};
      });
  },

  /**
   * 根据当前节点id获取所有直接子节点
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getChildren: function(id, domain) {
    var body = {
      domain: domain,
      orgId: id,
    }
    return request.post('/address/getRoot', body)
      .then(function newState(result) {
        return { type: types.SELECT_GET_CHILDREN, data: result.body.data || []};
      });
  },

  /**
   * 查询子节点和成员
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getSubAndPerson: function(id, domain) {
    var body = {
      domain: domain,
      deptId: id,
    }
    return request.post('/address/getSubAndPerson', body)
      .then(function newState(result) {
        return { type: types.SELECT_GET_SUB_AND_PERSON, data: result.body.data || []};
      });
  },

  /**
   * 选择一个人员
   * @param  {[type]} people [description]
   * @return {[type]}        [description]
   */
  selectPeople: function(people) {
    return Promise.resolve({ type: types.SELECT_PEOPLE, people: people });
  },

  /**
   * 取消选择一个人员
   * @param  {[type]} people [description]
   * @return {[type]}        [description]
   */
  unSelectPeople: function(people) {
    return Promise.resolve({ type: types.UNSELECT_PEOPLE, people: people });
  },

  /**
   * 当前列表全选
   * @return {[type]} [description]
   */
  selectAll: function() {
    return Promise.resolve({ type: types.SELECT_PEOPLE_ALL});
  },

  /**
   * 当前列表全部取消
   * @return {[type]} [description]
   */
  unSelectAll: function() {
    return Promise.resolve({ type: types.UNSELECT_PEOPLE_ALL});
  },

  /**
   * 加载完成
   * @return {[type]} [description]
   */
  loaded: function() {
    return { type: types.SELECT_LOADED };
  },

  /**
   * 加载中
   * @return {[type]} [description]
   */
  loading: function() {
    return { type: types.SELECT_LOADING };
  },

};
