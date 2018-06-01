var React = require('react');
var connect = require('react-redux').connect;
var ContactsActions = require('../actions/contacts');
var BaseActions = require('../actions/base');
var Notifications = require('react-notify-toast').default;
var Spinner = require('../components/Spinner');
var cs = require('classnames');
var Promise = require('promise');
var fastclick = require('fastclick');

var configureStore = require('../store/configureStore');
var store = configureStore();

require('normalize.css/normalize.css');
require('assets/css/base.less');
require('assets/css/spinner.less');

var App = React.createClass({
  
  propTypes: {
    children: React.PropTypes.object,
    //不传的时候，React-Redux会自动将dispatch注入组件的props。
    dispatch: React.PropTypes.func,
    loading: React.PropTypes.bool,
    domain: React.PropTypes.string,
  },

  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用
  componentWillMount: function() {
    var self = this;

    BaseActions.info()
      .then(function actionFunc(action) {
        self.props.dispatch(action);
        return Promise.resolve();
      })
      .then(function() {
        self.props.dispatch(ContactsActions.loading());
        ContactsActions
          .init(self.props.domain)
          .then(function actionFunc(action) {
            self.props.dispatch(action);
            self.props.dispatch(ContactsActions.loaded());
          });
      });
  },

  //componentWillMount-->render-->componentDidMount
  componentDidMount: function() {
    fastclick.attach(document.body); // 消除浏览器300ms点击延迟
  },
  
  render: function() {
    return (
      <div>
        <Notifications />
        
        <div className={cs({'spinner-mask': true, 'spinner-hide': !this.props.loading})} >
          <div className="spinner-box">
            <Spinner />  
          </div>
        </div>
        {this.props.children}
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    loading: state.contacts.loading || state.select.loading,
    domain: state.base.info.domain,
  };
}

module.exports = connect(mapStateToProps)(App);
