var express = require('express');
var router = express.Router();
var resRule = require('../helpers/response_rule');
var CategoryDao = require('../dao/category');
var FeedBackDao = require('../dao/feedback');

/**
 * 添加分类
 */
router.post('/add', function (req, res, next) {

    var user_id = req.session.user._id;
    var name = req.body.name || '';
    if (name == '') {
        res.json(resRule.error('分类名称不能为空!'));
        return;
    }

    CategoryDao.findOne({'name': name}, function (error, data) {
        if (error) {
            return next(error);
        }
        if (data) {
            res.json(resRule.error('分类名已经存在!'));
            return;
        }

        CategoryDao.save({name: name, user_id: user_id}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(resRule.success('添加成功！', data));
        });
    });

});

/**
 * 查询所有分类
 */
router.get('/find', function (req, res, next) {

    CategoryDao.find({}, function (error, data) {
        if (error) {
            return next(error);
        }
        res.json(resRule.success('查询成功！', data));
    });

});


module.exports = router;