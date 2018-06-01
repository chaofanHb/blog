var combineReducers = require('redux').combineReducers;
var contacts = require('./contacts');
var select = require('./select');
var base = require('./base')

var rootReducer = combineReducers({
  base: base,
  contacts: contacts,
  select: select,
});

module.exports = rootReducer;
