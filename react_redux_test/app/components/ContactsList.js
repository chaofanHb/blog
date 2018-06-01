/**
 * ContactsList Component
 * @authors yanjixiong 
 * @date    2016-07-11 10:34:12
 */

var React = require('react');
var connect = require('react-redux').connect;
var ContactsItem = require('./ContactsItem');
var PeopleItem = require('./PeopleItem');
var PeopleItemDetail = require('./PeopleItemDetail');

var noContactImg = require('assets/imgs/ic_no_contact.png');

var ContactsList = React.createClass({

  propTypes: {
    contactsList: React.PropTypes.array,
    isSearch: React.PropTypes.bool,
  },

  renderItem: function renderItem(item, index) {
    if (this.props.isSearch && item.type === 'person') {

      // 搜索时使用详细信息组件
      return (
        <PeopleItemDetail
          contact={item}
          key={item.id + index}
          />
      );
    } else if (!this.props.isSearch && item.type === 'person') {
      return (
        <PeopleItem
          contact={item}
          key={item.id + index}
          />
      );
    } else if (item.type === 'org' || item.type === 'dept') {
      return (
        <ContactsItem 
          contact={item} 
          key={item.id + index} 
          />
      );
    }
    return null;
  },

  render: function() {
    var self = this;
    var style = {
      img: {
        display: 'block',
        margin: '0 auto',
        width: '5.5rem',
      },
      empty: {
        display: 'block',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        height: '6.75rem',
        width: '6.5rem',
        color: '#aaaaaa',
      },
      text: {
        marginLeft: '.25rem',
      },
    }
    return (
      <div>
        {this.props.contactsList.map(function mapFunc(item, index) {
          return (self.renderItem(item, index));
        })}

        {
          this.props.contactsList.length === 0 ?
            (
              <div style={style.empty}>
                <img style={style.img} src={noContactImg} alt="" />
                <span style={style.text}>该部门下无成员</span>
              </div>
            ) : 
            null
        }
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    isSearch: state.contacts.isSearch,
  };
}

module.exports = connect(mapStateToProps)(ContactsList);
