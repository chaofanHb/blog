/**
 * People Detail Item Component
 *
 * 搜索时展现的人员Item
 * 
 * @authors yanjixiong
 * @date    2016-12-27 17:32:04
 */

var React = require('react');
var connect = require('react-redux').connect;
var cs = require('classnames');
var SelectActions = require('../../actions/select');
var zhixinHybrid = require('../../util/hybrid');

require('assets/css/select/peopleDetail.less');
require('assets/css/notify.less');
var defaultAvatar = require('assets/imgs/default.png');
var iconSelect = require('assets/imgs/icon_select.png');
var iconNotSelect = require('assets/imgs/icon_not_select.png');
var iconDisabelSelect = require('assets/imgs/icon_select_disable.png');

var PeopleItemDetail = React.createClass({

  propTypes: {
    contact: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    selectedPeople: React.PropTypes.object,
  },

  /**
   * 添加好友
   * @return {[type]} [description]
   */
  onSelect: function(e) {
    var self = this;

    SelectActions
      .selectPeople(this.props.contact)
      .then(function addFriendDone(result) {
        self.props.dispatch(result);

        // 通过能力向native添加
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'pickContactsFromRemote(contactIds,contactNanes)',
          param: {
            contactIds: [self.props.contact.username],
            contactNanes: [self.props.contact.name],
          },
        });
      })
    e.stopPropagation(); // 阻止事件冒泡
  },

  onUnSelect: function(e) {
    var self = this;

    SelectActions
      .unSelectPeople(this.props.contact)
      .then(function unSelectdDone(result) {
        self.props.dispatch(result);
        
        // 通过能力从native删除选中
        zhixinHybrid.requestHybridToZHIXIN({
          tagname: 'removeContactsFromRemote(contactIds,contactNanes)',
          param: {
            contactIds: [self.props.contact.username],
            contactNanes: [self.props.contact.name],
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

  /**
   * 什么都不干
   * @return {[type]} [description]
   */
  noop: function(e) {
    e.stopPropagation(); // 阻止事件冒泡
  },

  render: function() {
    var id = this.props.contact.id;
    var avatar = this.props.contact.headUrl ? this.props.contact.headUrl : defaultAvatar;
    var deptNames = this.props.contact.deptNames || '';
    var deptNameArr = deptNames.split(',');
    var deptLen = deptNames.split(',').length;
    var isSelf = id === this.props.currentId;

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
          <div className="item-friends">
          {
            !this.props.selectedPeople[id] && !isSelf
              ? <img src={iconNotSelect} onClick={this.onSelect} />
              : null
          }
          {
            this.props.selectedPeople[id] && !isSelf
              ? <img src={iconSelect} onClick={this.onUnSelect} />
              : null
          }
          {
            isSelf
              ? <img src={iconDisabelSelect} onClick={this.noop} />
              : null
          }
          </div>
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    selectedPeople: state.select.selectedPeople,
    currentId: state.base.info.id,
  };
}

module.exports = connect(mapStateToProps)(PeopleItemDetail);
