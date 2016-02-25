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
    var level = req.body.level || 'admin';  // admin--管理员 normal--普通用户

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
router.get('/delete', function (req, res, next) {

    var user_id = req.query.id || '';

    UserDao.findByIdAndRemove(user_id, function (error, user) {
        if (error) {
            return next(error);
        }

        res.json(resRule.success('删除成功！', user));

    });

});

/**
 * 查询所有用户
 */
router.get('/find', function (req, res, next) {

    UserDao.find({}, function (error, data) {
        if (error) {
            return next(error);
        }
        res.json(resRule.success('查询成功！', data));
    });

});

/**
 * 用户信息更改
 */

router.post('/updateLevel', function (req, res, next) {

    var user_id = req.body.id;
    var level = req.body.level || '';  // admin--管理员 normal--普通用户
    if (level == '') {
        res.json(resRule.error('权限不能为空'));
        return;
    }

    UserDao.findByIdAndUpdate(user_id, {level: level}, function (error, data) {
        if (error) {
            return next(error);
        }
        res.json(resRule.success('更新成功！', data));
    });

});

module.exports = router;