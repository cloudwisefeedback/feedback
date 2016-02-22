var express = require('express');
var router = express.Router();
var resRule = require('../helpers/response_rule');
var FeedBackDao = require('../dao/feedback');
var CategoryDao = require('../dao/category');

/**
 * 添加反馈
 */
router.post('/add', function (req, res, next) {

    var category_id = req.body.category || '';
    var text = req.body.text || '';

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (category_id === '') {
        res.json(resRule.error('反馈分类为必选项!'));
        return;
    } else if (text === '') {
        res.json(resRule.error('反馈内容不能为空!'));
        return;
    }
    FeedBackDao.save({category_id: category_id, text: text, ip: ip}, function (err, data) {
        if (err) {
            return next(err);
        }
        CategoryDao.findByIdAndUpdate(category_id, {$inc: {feedback_count: 1}}, function (err) {
            if (err) {
                FeedBackDao.findByIdAndRemove(data._id);
                return next(err);
            }

            res.json(resRule.success('添加成功！', data));
        });
    });
});

/**
 * 查询所有反馈信息
 */
router.get('/find', function (req, res, next) {

    FeedBackDao.find({}, function (error, data) {
        if (error) {
            return next(error);
        }
        res.json(resRule.success('查询成功！', data));
    });

});


/**
 * 根据分类查询
 */
router.get('/findByCategory', function (req, res, next) {
    var category_id = req.query.category;

    FeedBackDao.find({category_id: category_id}, function (error, data) {
        if (error) {
            return next(error);
        }
        res.json(resRule.success('查询成功！', data));
    });

});

module.exports = router;