/**
 * Header Component
 * @authors yanjixiong
 * @date    2016-09-12 11:28:02
 */

var React = require('react');
var connect = require('react-redux').connect;
var ContactsActions = require('../actions/contacts');
var notify = require('react-notify-toast').notify;
var zhixinHybrid = require('../util/hybrid');

require('assets/css/header.less');

var Header = React.createClass({

  propTypes: {
    prev: React.PropTypes.object,
    current: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    showAddAll: React.PropTypes.bool,
    domain: React.PropTypes.string,
  },

  /**
   * 点击事件
   * @return {[type]} [description]
   */
  handleClick: function handleClick() {
    var self = this;
    var prevName = self.props.prev.name;

    this.props.dispatch(ContactsActions.loading());

    if (this.props.prev.type === 'org') {
      ContactsActions
      .getChildren(this.props.prev.id, self.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list); // 更新列表
        self.props.dispatch(ContactsActions.treeBack()); // 操作上下级堆栈
        self.changeTitle(prevName); // 设置标题
      })
    } else if (this.props.prev.type === 'dept') {
      ContactsActions
      .getSubAndPerson(this.props.prev.id, self.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list); // 更新列表
        self.props.dispatch(ContactsActions.treeBack()); // 操作上下级堆栈
        self.changeTitle(prevName); // 设置标题
      })
    } else if (!this.props.prev.type) {
      ContactsActions
      .init(self.props.domain)
      .then(function actionFunc(action) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(action); // 更新列表
        self.props.dispatch(ContactsActions.treeBack()); // 操作上下级堆栈
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
   * 将部门所有成员加为好友
   */
  addFriendsFromDept: function(e) {
    e.stopPropagation();
    var self = this;
    var currentLevel = this.props.current;
    ContactsActions
      .addFriendsFromDept(currentLevel.id, self.props.domain)
      .then(function done(action) {
        self.props.dispatch(action);
        notify.show('添加成功', null, 2000);
        // 添加好友成功,将添加成功username传入native
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'addFriendsSucc(usernames)',
          param: {
            usernames: action.data,
          },
        });
      });
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
            <span className="text-primary" onClick={ this.addFriendsFromDept }>添加全部</span>
          ) :
          null
        }
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  var status = state.contacts.status;
  var len = status.length;
  var prev = null;
  if (len > 1) {
    prev = status[len - 2]
  }

  return {
    current: state.contacts.current,
    prev: prev,
    showAddAll: state.contacts.showAddAll,
    domain: state.base.info.domain,
  };
}

module.exports = connect(mapStateToProps)(Header);
