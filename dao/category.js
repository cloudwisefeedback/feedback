var BaseDao = require('./base');
var Category = require('../models').Category;
var util = require('util');

function CategoryDao() {
    BaseDao.call(this, Category);
}
util.inherits(CategoryDao, BaseDao);

module.exports = new CategoryDao();