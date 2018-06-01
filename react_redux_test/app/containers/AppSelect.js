/**
 * AppSelect
 * @authors yanjixiong
 * @date    2017-02-14 08:53:00
 */

var React = require('react');
var connect = require('react-redux').connect;
var Header = require('../components/Select/Header');
var SearchBox = require('../components/Select/SearchBox');
var SelectContainer = require('../components/Select/SelectContainer');


var AppSelect = React.createClass({
  
  propTypes: {
    contactsList: React.PropTypes.array,
    status: React.PropTypes.array,
  },

  render: function() {
    return (
      <div>
        { this.props.status.length > 1 ? <Header /> : null }
        { this.props.status.length === 1 ? <SearchBox /> : null }
        <SelectContainer
          contactsList={this.props.contactsList}
          status={this.props.status}
          />
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    contactsList: state.select.contactsList,
    status: state.select.status.length === 0 ? [] : state.select.status,
  }
}

module.exports = connect(mapStateToProps)(AppSelect);