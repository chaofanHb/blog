/**
 * route
 * @authors yanjixiong 
 * @date    2016-07-11 16:15:25
 */

var React = require('react');
var Route = require('react-router').Route;
var App = require('./containers/App');

module.exports = {
  component: App,
  childRoutes: [
    { 
      path: '/',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/AppFriend'))
        }, 'app_friend');
      },
    },
    { 
      path: '/select',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/AppSelect'))
        }, 'app_select');
      },
    },
  ],
};
