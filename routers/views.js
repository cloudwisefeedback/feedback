var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

/**
 * 登录
 */
router.get('/singin', function (req, res, next) {
    if (req.session && req.session.user) {
        res.redirect('/list');
    } else {
        next();
    }
}, function (req, res, next) {
    res.render('singin', {title: '登录'});
});

/**
 * 意见反馈
 */
router.get('/', function (req, res, next) {
    res.render('commit', {title: '意见反馈'});
});

/**
 * 意见查看
 */
router.get('/list', auth, function (req, res, next) {
    res.render('list', {title: '反馈列表'});
});

module.exports = router;