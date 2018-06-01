/**
 * contacts action
 * @authors yanjixiong
 * @date    2016-07-11 08:58:29
 */

var types = require('../constants');
var request = require('../util/request');

module.exports = {
  /**
   * 跳到的节点对象
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  treeForward: function(node) {
    return { type: types.TREE_FORWARD, node: node };
  },

  /**
   * 回退到上一级节点
   * @return {[type]}       [description]
   */
  treeBack: function() {
    return { type: types.TREE_BACK };
  },

  /**
   * 搜索
   * @param  {[type]} keyword [description]
   * @return {[type]}         [description]
   */
  search: function(keyword, domain) {
    var action = { type: types.SEARCH};
    var body = { 
      domain: domain,
      name: keyword,
    };
    return request
      .post('/address/searchPerson', body)
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
    return { type: types.KEYWORD, keyword: keyword };
  },

  /**
   * 初始化列表数据
   * @return {[type]} [description]
   */
  init: function(domain) {
    var body = { 
      domain: domain,
    };
    return request.post('/address/init', body)
      .then(function onResult(res) {
        return {type: types.INIT, contactsList: res.body.data || []};
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
        return { type: types.GET_CHILDREN, data: result.body.data || [] };
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
        return { type: types.GET_SUB_AND_PERSON, data: result.body.data || []};
      });
  },

  /**
   * 添加好友
   * @param {[type]} friendId [description]
   */
  addFriend: function(friendId, domain) {
    var body = {
      domain: domain,
      friendId,
    }
    return request.post('/address/addFriend', body)
      .then(function newState(result) {
        return { type: types.ADD_FRIEND, data: result.body.data} // 判断当前好友index改变store中的值
      })
  },

  /**
   * 添加部门中成员为好友
   * @param {[type]} deptId [description]
   */
  addFriendsFromDept: function(deptId, domain) {
    var body = {
      domain: domain,
      deptId,
    }

    return request.post('/address/addDeptFriend', body)
      .then(function newState(result) {
        return { type: types.ADD_DEPT_FRIEND, data: result.body.data} // 判断当前好友index改变store中的值
      })
  },

  /**
   * 加载完成
   * @return {[type]} [description]
   */
  loaded: function() {
    return { type: types.LOADED };
  },

  /**
   * 加载中
   * @return {[type]} [description]
   */
  loading: function() {
    return { type: types.LOADING };
  },

};
