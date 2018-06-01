/**
 * SerarchBox Component
 * @authors yanjixiong 
 * @date    2016-07-11 10:24:01
 */

var React = require('react');
var connect = require('react-redux').connect;
var ContactsActions = require('../actions/contacts');

require('assets/css/search.less');
var isOnComposition = false;
var SearchBox = React.createClass({

  propTypes: {
    keyword: React.PropTypes.string,
  },

  onChange: function(e) {
    var self = this;
    self.props.dispatch(ContactsActions.keywordChange(e.target.value));
    self.props.dispatch(ContactsActions.loading());

    // 关键字为空时初始化数据
    if (!/\S/.test(e.target.value)) {
      ContactsActions
      .init(this.props.domain)
      .then(function actionFunc(action) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(action);
      });
      return;
    }
    if (!isOnComposition) {
      ContactsActions
      .search(e.target.value, self.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list);
      })
    }
  },
  
  handleComposition: function(e) {
    var self = this;
    if (e.type === 'compositionend') {
      isOnComposition = false;
      ContactsActions
      .search(e.target.value, self.props.domain)
      .then(function listFunc(list) {
        self.props.dispatch(ContactsActions.loaded());
        self.props.dispatch(list);
      })
    } else {
      isOnComposition = true
    }
  },

  render: function() {
    return (
      <div>
        <div className="search-box-container">
          <div className="search-box">
            <div className="search-input">
              <input type="text" 
                value={this.props.keyword}
                onChange={this.onChange}
                onCompositionStart={this.handleComposition}
                onCompositionUpdate={this.handleComposition}
                onCompositionEnd={this.handleComposition}
                placeholder="请输入联系人" 
                />  
            </div>
          </div>
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    keyword: state.contacts.keyword,
    domain: state.base.info.domain,
  };
}

module.exports = connect(mapStateToProps)(SearchBox);
