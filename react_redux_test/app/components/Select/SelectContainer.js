/**
 * ContactsContainer Component
 * @authors yanjixiong 
 * @date    2016-07-11 11:02:16
 */

var React = require('react');
var connect = require('react-redux').connect;
var SelectList = require('./SelectList');

var ContactsContainer = React.createClass({

  propTypes: {
    status: React.PropTypes.array,
    contactsList: React.PropTypes.array,
  },

  render: function() {
    return (
      <div className="list-contacts-container">
        <SelectList 
          contactsList={this.props.contactsList} 
          />
      </div>
    );
  },
});

function mapStateToProps() {
  return {

  };
}

module.exports = connect(mapStateToProps)(ContactsContainer);
