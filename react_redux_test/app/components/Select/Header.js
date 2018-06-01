/**
 * Header Component
 * @authors yanjixiong
 * @date    2016-09-12 11:28:02
 */

var React = require('react');
var connect = require('react-redux').connect;
var SelectActions = require('../../actions/select');
var zhixinHybrid = require('../../util/hybrid');

require('assets/css/header.less');

var Header = React.createClass({

  propTypes: {
    prev: React.PropTypes.object,
    current: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    showAddAll: React.PropTypes.bool,
    currentPeopleCount: React.PropTypes.number,
    contactsList: React.PropTypes.array,
    selectedPeople: React.PropTypes.object,
    domain: React.PropTypes.string,
  },

  /**
   * 点击事件
   * @return {[type]} [description]
   */
  handleClick: function handleClick() {
    var self = this;
    var prevName = self.props.prev.name;

    this.props.dispatch(SelectActions.loading());

    if (this.props.prev.type === 'org') {
      SelectActions
      .getChildren(this.props.prev.id, this.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(SelectActions.loaded());
        self.props.dispatch(list); // 更新列表
        self.props.dispatch(SelectActions.treeBack()); // 操作上下级堆栈
        self.changeTitle(prevName); // 设置标题
      })
    } else if (this.props.prev.type === 'dept') {
      SelectActions
      .getSubAndPerson(this.props.prev.id, this.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(SelectActions.loaded());
        self.props.dispatch(list); // 更新列表
        self.props.dispatch(SelectActions.treeBack()); // 操作上下级堆栈
        self.changeTitle(prevName); // 设置标题
      })
    } else if (!this.props.prev.type) {
      SelectActions
      .init(this.props.domain)
      .then(function actionFunc(action) {
        self.props.dispatch(SelectActions.loaded());
        self.props.dispatch(action); // 更新列表
        self.props.dispatch(SelectActions.treeBack()); // 操作上下级堆栈
        self.changeTitle('组织架构'); // 设置为组织架构
      });
    }
  },

  /**
   * 改变原生标题
   * @param  {[type]} title [description]
   * @return {[type]}       [description]
   */
  changeTitle: function(title) {
    zhixinHybrid.requestHybridToZHIXIN({
      tagname: 'setTitle(title)',
      param: {
        title: title,
      },
    });
  },

  /**
   * 全选当前列表
   */
  selectAll: function(e) {
    var self = this;

    var selectIds = [];
    var selectNames = [];

    self.props.contactsList.forEach(contact => {
      // 只有选中的才进行添加
      if (!self.props.selectedPeople[contact.id]) {
        selectIds.push(contact.username);
        selectNames.push(contact.name);
      }
    })

    SelectActions
      .selectAll()
      .then(function done(action) {
        self.props.dispatch(action);

        // 一次选择多个加入native列表
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'pickContactsFromRemote(contactIds,contactNanes)',
          param: {
            contactIds: selectIds,
            contactNanes: selectNames,
          },
        });
      });
    e.stopPropagation();
  },

  /**
   * 当前列表全部取消选择
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  unSelectAll: function(e) {
    var self = this;

    var unSelectIds = [];
    var unSelectNames = [];

    self.props.contactsList.forEach(contact => {
      // 不是已选中的不进行移除
      if (self.props.selectedPeople[contact.id]) {
        unSelectIds.push(contact.username);
        unSelectNames.push(contact.name);
      }
    })

    SelectActions
      .unSelectAll()
      .then(function done(action) {
        self.props.dispatch(action);

        // 一次取消多个native列表
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'removeContactsFromRemote(contactIds,contactNanes)',
          param: {
            contactIds: unSelectIds,
            contactNanes: unSelectNames,
          },
        });
      });

    e.stopPropagation();
  },

  render: function() {
    return (
      <div className="header" onClick={this.handleClick}>
        <div className="header-left">
          <a className="action action-back" >
          </a>
        </div>
        <div className="header-center">
          <span>返回上一级</span>
        </div>
        <div className="header-right">
        {
          this.props.showAddAll ? 
          (
            <span className="text-primary" onClick={ this.selectAll }>选择全部</span>
          ) : null
        }
        {
          !this.props.showAddAll && this.props.currentPeopleCount > 0 ?
          (
            <span className="text-primary" onClick={ this.unSelectAll }>取消全部</span>
          ) : null
        }
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  var status = state.select.status;
  var len = status.length;
  var prev = null;
  if (len > 1) {
    prev = status[len - 2]
  }

  return {
    current: state.select.current,
    prev: prev,
    showAddAll: state.select.showAddAll,
    // 当前列表中有人员时才渲染取消全部
    currentPeopleCount: state.select.contactsList
      .filter(item => item && item.type && item.type === 'person').length,
    contactsList: state.select.contactsList,
    selectedPeople: state.select.selectedPeople,
    domain: state.base.info.domain,
  };
}

module.exports = connect(mapStateToProps)(Header);
