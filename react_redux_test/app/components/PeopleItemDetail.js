/**
 * People Detail Item Component
 * @authors yanjixiong
 * @date    2016-12-27 17:32:04
 */

var React = require('react');
var connect = require('react-redux').connect;
var cs = require('classnames');
var notify = require('react-notify-toast').notify;
var ContactsActions = require('../actions/contacts');
var zhixinHybrid = require('../util/hybrid');

require('assets/css/peopleDetail.less');
require('assets/css/notify.less');
var defaultAvatar = require('assets/imgs/default.png');

var PeopleItemDetail = React.createClass({

  propTypes: {
    contact: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  },

  /**
   * 添加好友
   * @return {[type]} [description]
   */
  onAddFriend: function(e) {
    var self = this;

    self.props.dispatch(ContactsActions.loading());

    ContactsActions
      .addFriend(this.props.contact.id, self.props.domain)
      .then(function addFriendDone(result) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(result);
        notify.show('添加成功', null, 2000);
        // 添加好友成功,将添加成功username传入native
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'addFriendsSucc(usernames)',
          param: {
            usernames: result.data,
          },
        });
      })
    e.stopPropagation(); // 阻止事件冒泡
  },

  /**
   * 图片加载失败
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onImgError: function(e) {
    e.target.src = defaultAvatar;
  },

  /**
   * 跳到原生详情页
   * @return {[type]} [description]
   */
  toNativeDetail: function() {
    zhixinHybrid.requestHybridToZHIXIN({
      tagname: 'showUser(user)',
      param: {
        user: this.props.contact.username,
      },
    });
  },

  render: function() {
    var avatar = this.props.contact.headUrl ? this.props.contact.headUrl : defaultAvatar;
    var deptNames = this.props.contact.deptNames || '';
    var deptNameArr = deptNames.split(',');
    var deptLen = deptNames.split(',').length;
    return (
      <div className="cell" onClick={this.toNativeDetail}>
        <div className="item-people">
          <div className="item-avatar">
            <img src={ avatar } onError={this.onImgError} alt="" />
          </div>
          <div className="item-name-detail">
            <span>{this.props.contact.name}</span>
            <span className="item-dept">
              {
                !deptNames || deptLen.length === 0
                  ? <label className="part-long">无部门</label>
                  : null
              }
              {
                deptNames 
                  ? <label className={cs({part: deptLen > 1, 'part-long': deptLen === 1})}>{deptNameArr[0]}</label>
                  : null
              }
              {
                deptNames && deptLen > 1
                  ? (
                    <label className="part">—{deptNameArr[1]}</label>
                  )
                  : null
              }
            </span>
          </div>
          {
            !this.props.contact.isFriend && this.props.contact.id !== this.props.currentId ? 
            (
              <div className="item-friends">
                <button className="btn btn-primary btn-outline" onClick={this.onAddFriend}>添加</button>
              </div>
            ) :
            null
          }
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    domain: state.base.info.domain,
    currentId: state.base.info.id,
  };
}

module.exports = connect(mapStateToProps)(PeopleItemDetail);
