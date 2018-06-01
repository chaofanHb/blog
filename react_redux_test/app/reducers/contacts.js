/**
 * contacts reducer
 * @authors yanjixiong 
 * @date    2016-07-12 18:22:25
 */

var types = require('../constants');

module.exports = function constants(state, action) {
  var newArr;
  var personCount = 0;
  var friendCount = 0;
  var oldState = !state 
  ? {
    contactsList: [],
    status: [{
      name: '组织架构',
    }],

    // 当前菜单节点
    current: {
      name: '组织架构',
    },

    keyword: '', // 搜索的关键字

    token: null, // native登录token

    loading: false, // 正在加载中

    showAddAll: false, // 显示添加全部为好友按钮

    isSearch: false, // 是否是搜索
  } 
  : state;

  // console.log(action);

  switch (action.type) {

  // 进入一级目录
  case types.TREE_FORWARD:
    newArr = Array.prototype.concat(oldState.status, action.node);

    return Object.assign({}, oldState, {
      status: newArr,
      current: newArr[newArr.length - 1],
    });

  // 回退一级目录
  case types.TREE_BACK:
    if (oldState.status.length < 2) return oldState;
    newArr = oldState.status.splice(0, oldState.status.length - 1);

    return Object.assign({}, oldState, {
      status: newArr,
      current: newArr[newArr.length - 1],
    });

  // 搜索联系人名称
  case types.SEARCH:
    return Object.assign({}, oldState, { 
      contactsList: action.contactsList.filter(item => !!item) || [],
    });

  // 改变搜索关键字
  case types.KEYWORD:
    return Object.assign({}, oldState, {
      keyword: action.keyword,
      isSearch: true,
    });

  // 初始化列表数据
  case types.INIT:
    return Object.assign({}, oldState, {
      contactsList: action.contactsList.filter(item => !!item),
      isSearch: false,
    });

  // 查询子级
  case types.GET_CHILDREN:
    personCount = action.data
      .filter((item) => { return item && item.type && item.type === 'person' }).length;
    friendCount = action.data
      .filter((item) => { return item && item.hasOwnProperty('isFriend') && item.isFriend }).length;

    return Object.assign({}, oldState, {
      contactsList: action.data.filter(item => !!item),
      showAddAll: personCount > 0 && personCount !== friendCount,
    });

  // 获取子级和成员
  case types.GET_SUB_AND_PERSON:
    personCount = action.data
      .filter(item => item && item.type && item.type === 'person').length;
    friendCount = action.data
      .filter(item => item && item.hasOwnProperty('isFriend') && item.isFriend).length;

    return Object.assign({}, oldState, {
      contactsList: action.data.filter(item => !!item),
      showAddAll: personCount > 0 && personCount !== friendCount,
    });

  // 添加好友
  case types.ADD_FRIEND:
    newArr = oldState.contactsList.map(function mapFunc(contact) {
      var result = contact;

      if (result && result.username === action.data[0]) {
        // 不能直接赋值，此处直接赋值，引用不变，被认为对象未改变，则不重新渲染
        result = Object.assign({}, result, {isFriend: true});
      }
      return result;
    });

    // 添加后，如果所有的成员已加好友，则不显示添加全部
    personCount = newArr
      .filter(item => item && item.type && item.type === 'person').length;
    friendCount = newArr
      .filter(item => item && item.hasOwnProperty('isFriend') && item.isFriend).length;

    return Object.assign({}, oldState, {
      contactsList: newArr,
      showAddAll: personCount > 0 && personCount !== friendCount,
    });

  // 添加部门成员为好友
  case types.ADD_DEPT_FRIEND:
    // 将当前部门所有成员的好友状态改变
    newArr = oldState.contactsList.map(function mapFunc(contact) {
      // 不能直接赋值，此处直接赋值，引用不变，被认为对象为改变，则不重新渲染
      var result = contact;
      if (result && action.data.indexOf(result.username) !== -1) {
        // 不能直接赋值，此处直接赋值，引用不变，被认为对象为改变，则不重新渲染
        result = Object.assign({}, result, {isFriend: true});
      }
      return result;
    });

    // 添加后，如果所有的成员已加好友，则不显示添加全部
    personCount = newArr
      .filter((item) => { return item && item.type && item.type === 'person' }).length;
    friendCount = newArr
      .filter((item) => { return item && item.hasOwnProperty('isFriend') && item.isFriend }).length;

    return Object.assign({}, oldState, {
      contactsList: newArr,
      showAddAll: personCount > 0 && personCount !== friendCount,
    });

  // 设置token
  case types.TOKEN:
    return Object.assign({}, oldState, {
      token: action.token,
    });

  // 加载完成
  case types.LOADED:
    console.log(oldState);
    return Object.assign({}, oldState, {
      loading: false,
    })

  // 正在加载
  case types.LOADING: 
    return Object.assign({}, oldState, {
      loading: true,
    });



  default:
    return oldState;
  }
}
