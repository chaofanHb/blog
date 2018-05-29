var React = require('react');
//var AppRoutes = require('./containers/App');
import AppRoutes from './containers/App';
var render = require('react-dom').render;


render(
<AppRoutes/>,
    document.getElementById('main'));