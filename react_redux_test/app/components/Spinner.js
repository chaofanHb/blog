/**
 * Spinner component
 * @authors yanjixiong
 * @date    2016-09-18 11:47:58
 */

var React = require('react');

var loadingGif = require('assets/imgs/loading_white.gif');

var Spinner = React.createClass({

  render: function() {
    return (
      <div className="spinner">
        <img src={loadingGif} />
      </div>
    );
  },

});

module.exports = Spinner;