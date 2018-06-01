var React = require('react');
var render = require('react-dom').render;
var Provider = require('react-redux').Provider;
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;
var hashHistory = require('react-router').hashHistory;
var configureStore = require('./store/configureStore');
var store = configureStore();
var routes = require('./routes');

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('contacts')
)
