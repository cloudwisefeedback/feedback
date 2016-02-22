var BaseDao = require('./base');
var FeedBack = require('../models').FeedBack;
var util = require('util');

function FeedBackDao() {
    BaseDao.call(this, FeedBack);
}
util.inherits(FeedBackDao, BaseDao);

module.exports = new FeedBackDao();