/**
 * ContactsItem Component
 * @authors yanjixiong 
 * @date    2016-07-11 10:41:33
 */

var React = require('react');
var connect = require('react-redux').connect;
var SelectActions = require('../../actions/select');
var zhixinHybrid = require('../../util/hybrid');

require('assets/css/select/people.less');
require('assets/css/notify.less');
var defaultAvatar = require('assets/imgs/default.png');
var iconSelect = require('assets/imgs/icon_select.png');
var iconNotSelect = require('assets/imgs/icon_not_select.png');
var iconDisabelSelect = require('assets/imgs/icon_select_disable.png');

var PeopleItem = React.createClass({

  propTypes: {
    contact: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    selectedPeople: React.PropTypes.object,
  },

  /**
   * 选择人员
   * @return {[type]} [description]
   */
  onSelect: function(e) {
    var self = this;
    SelectActions
      .selectPeople(this.props.contact)
      .then(function selectDone(result) {
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

  /**
   * 取消选择
   * @return {[type]} [description]
   */
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
    var isSelf = id === this.props.currentId;
    
    return (
      <div className="cell" onClick={this.toNativeDetail}>
        <div className="item-people">
          <div className="item-avatar">
            <img src={ avatar } onError={this.onImgError} alt="" />
          </div>
          <div className="item-name">
            <span>{this.props.contact.name}</span>
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

module.exports = connect(mapStateToProps)(PeopleItem);
