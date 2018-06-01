/**
 * AppFriend
 * @authors yanjixiong 
 * @date    2016-07-11 16:39:17
 */

var React = require('react');
var connect = require('react-redux').connect;
var Header = require('../components/Header');
var SearchBox = require('../components/SearchBox');
var ContactsContainer = require('../components/ContactsContainer');


var AppFriend = React.createClass({
  
  propTypes: {
    contactsList: React.PropTypes.array,
    status: React.PropTypes.array,
  },

  render: function() {
    return (
      <div>
        { this.props.status.length > 1 ? <Header /> : null }
        { this.props.status.length === 1 ? <SearchBox /> : null }
        <ContactsContainer
          contactsList={this.props.contactsList}
          status={this.props.status}
          />
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    contactsList: state.contacts.contactsList,
    status: state.contacts.status.length === 0 ? [] : state.contacts.status,
  }
}

module.exports = connect(mapStateToProps)(AppFriend);
