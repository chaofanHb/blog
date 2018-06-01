/**
 * ContactsItem Component
 * @authors yanjixiong 
 * @date    2016-07-11 13:48:49
 */

var React = require('react');
var connect = require('react-redux').connect;
var ContactsActions = require('../actions/contacts');
var zhixinHybrid = require('../util/hybrid');

require('assets/css/contacts.less');

var defaultIcon = require('assets/imgs/icon_group.png');

var ContactsItem = React.createClass({

  propTypes: {
    contact: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    domain: React.PropTypes.string,
  },

  handleClick: function() {
    var self = this;
    var type = self.props.contact.type;

    self.props.dispatch(ContactsActions.loading());

    if (type === 'org') {
      ContactsActions
      .getChildren(this.props.contact.id, this.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list);
        self.changeTitle();
      })
    } else if (type === 'dept') {
      ContactsActions
      .getSubAndPerson(this.props.contact.id, this.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list);
        self.changeTitle();
      })
    }
    
    this.props.dispatch(ContactsActions.treeForward(this.props.contact));
  },

  /**
   * 改变原生app上标题
   * @return {[type]} [description]
   */
  changeTitle: function() {
    zhixinHybrid.requestHybridToZHIXIN({
      tagname: 'setTitle(title)',
      param: {
        title: this.props.contact.name,
      },
    });
  },

  render: function() {
    return (
      <div className="cell list-contacts-item" >
        <div className="item-title" 
          data-name={this.props.contact.title}
          onClick={this.handleClick}>
          <div className="item-avatar">
            <img src={ defaultIcon } />
          </div>
          <span className="item-name">{this.props.contact.name}</span>
          <label className="icon-forward"></label>
        </div>
      </div>
    );
  },
})

function mapStateToProps(state) {
  return {
    statusStrs: state.contacts.status.map(function mapFunc(item) {return item.name;}),
    domain: state.base.info.domain,
  }
}

module.exports = connect(mapStateToProps)(ContactsItem);
