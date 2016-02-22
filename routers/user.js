var express = require('express');
var router = express.Router();
var resRule = require('../helpers/response_rule');
var UserDao = require('../dao/user');

/**
 * 用户添加
 */
router.post('/add', function (req, res, next) {

    var username = req.body.username || '';
    var password = req.body.password || '123456';
    var level = req.body.level || 2;

    if (username === '') {
        res.json(resRule.error('用户名不能为空!'));
        return;
    }

    UserDao.findOne({'username': username}, function (error, data) {
        if (error) {
            return next(error);
        }
        if (data) {
            res.json(resRule.error('用户名已经存在!'));
            return;
        }

        UserDao.save({username: username, password: password, level: level}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(resRule.success('添加成功！', data));
        });
    });
});
/**
 * 登录
 */
router.post('/login', function (req, res, next) {

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (password === '' || username === '') {
        res.json(resRule.error('用户名或者密码不能为空!'));
        return;
    }
    UserDao.findOne({username: username}, function (error, user) {
        if (error) {
            return next(error);
        }

        if (!user) {
            res.json(resRule.error('用户不存在!'));
            return;
        }

        if (password !== user.password) {
            return res.json(resRule.error('密码输入错误!'));
        }
        // 设置session信息
        req.session.user = user;

        res.json(resRule.success('登录成功！', user));

    });

});

/**
 * 退出
 */
router.get('/exit', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            return next(err);
        }
        res.json(resRule.success('退出成功！'));
    });
});

/**
 * 用户删除
 */

/**
 * 用户信息编辑
 */

module.exports = router;