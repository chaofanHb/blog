var env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

module.exports = require('./react_redux_test/build/webpack.' + env);
