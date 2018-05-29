var env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

module.exports = require('./react_test/build/webpack.' + env);
