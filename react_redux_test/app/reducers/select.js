/**
 * select reducer
 * @authors yanjixiong
 * @date    2017-02-14 09:03:22
 */

var types = require('../constants');

module.exports = function constants(state, action) {
  var newArr;
  var personCount = 0;
  var selectCount = 0;
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

    showAddAll: false, // 显示选择全部

    isSearch: false, // 是否是搜索

    selectedPeople: {}, // 选择的人员，以key(id) value(people)形式存储
  } 
  : state;

  switch (action.type) {

  // 进入一级目录
  case types.SELECT_TREE_FORWARD:
    newArr = Array.prototype.concat(oldState.status, action.node);

    return Object.assign({}, oldState, {
      status: newArr,
      current: newArr[newArr.length - 1],
    });

  // 回退一级目录
  case types.SELECT_TREE_BACK:
    if (oldState.status.length < 2) return oldState;
    newArr = oldState.status.splice(0, oldState.status.length - 1);

    return Object.assign({}, oldState, {
      status: newArr,
      current: newArr[newArr.length - 1],
    });

  // 搜索联系人名称
  case types.SELECT_SEARCH:
    return Object.assign({}, oldState, { 
      contactsList: action.contactsList.filter(item => !!item) || [],
    });

  // 改变搜索关键字
  case types.SELECT_KEYWORD:
    return Object.assign({}, oldState, {
      keyword: action.keyword,
      isSearch: true,
    });

  // 初始化列表数据
  case types.SELECT_INIT:
    return Object.assign({}, oldState, {
      contactsList: action.contactsList.filter(item => !!item),
      isSearch: false,
    });

  // 查询子级
  case types.SELECT_GET_CHILDREN:
    personCount = action.data
      .filter((item) => { return item && item.type && item.type === 'person' }).length;
    selectCount = action.data
      .filter((item) => { return item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id] }).length;

    return Object.assign({}, oldState, {
      contactsList: action.data.filter(item => !!item),
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 获取子级和成员
  case types.SELECT_GET_SUB_AND_PERSON:
    personCount = action.data
      .filter(item => item && item.type && item.type === 'person').length;
    selectCount = action.data
      .filter(item => item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id]).length;

    return Object.assign({}, oldState, {
      contactsList: action.data.filter(item => !!item),
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 设置token
  case types.SELECT_TOKEN:
    return Object.assign({}, oldState, {
      token: action.token,
    });

  // 选择人员
  case types.SELECT_PEOPLE:
    var currentSelectPeople = action.people; // 本次选择的人员
    var selectedPeople = oldState.selectedPeople;
    selectedPeople[currentSelectPeople.id] = currentSelectPeople;
    // 建立新的引用
    selectedPeople = Object.assign({}, selectedPeople);

    // 重新计算是否显示全选
    personCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person').length;
    selectCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id]).length;

    return Object.assign({}, oldState, {
      selectedPeople: selectedPeople,
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 取消选择人员
  case types.UNSELECT_PEOPLE:
    var currentUnselectPeople = action.people; // 本次选择的人员
    var beforeUnselectPeople = oldState.selectedPeople;
    delete beforeUnselectPeople[currentUnselectPeople.id];
    // 生成新对象，只改变属性，对象引用未变无法触发更新
    beforeUnselectPeople = Object.assign({}, beforeUnselectPeople);

    // 重新计算是否显示全选
    personCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person').length;
    selectCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id]).length;

    return Object.assign({}, oldState, {
      selectedPeople: beforeUnselectPeople,
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 全选
  case types.SELECT_PEOPLE_ALL:
    var selectAllContainer = oldState.selectedPeople;

    oldState.contactsList
      .filter(item => item && item.type && item.type === 'person')
      .forEach(item => { selectAllContainer[item.id] = item; });

    selectAllContainer = Object.assign({}, selectAllContainer);

    // 重新计算是否显示全选
    personCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person').length;
    selectCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id]).length;

    return Object.assign({}, oldState, {
      selectedPeople: selectAllContainer,
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 全取消选择
  case types.UNSELECT_PEOPLE_ALL:
    var unSelectContainer = oldState.selectedPeople;

    oldState.contactsList
      .filter(item => item && item.type && item.type === 'person')
      .forEach(item => { delete unSelectContainer[item.id]; });

    unSelectContainer = Object.assign({}, unSelectContainer);

    // 重新计算是否显示全选
    personCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person').length;
    selectCount = oldState.contactsList
      .filter(item => item && item.type && item.type === 'person' && !!oldState.selectedPeople[item.id]).length;

    return Object.assign({}, oldState, {
      selectedPeople: unSelectContainer,
      showAddAll: personCount > 0 && personCount !== selectCount,
    });

  // 加载完成
  case types.SELECT_LOADED:
    return Object.assign({}, oldState, {
      loading: false,
    })

  // 正在加载
  case types.SELECT_LOADING: 
    return Object.assign({}, oldState, {
      loading: true,
    });



  default:
    return oldState;
  }
}
