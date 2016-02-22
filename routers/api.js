var express = require('express');
var router = express.Router();

var userRouter = require('./user');
var feedbackRouter = require('./feedback');
var categoryRouter = require('./category');

router.use('/user', userRouter);
router.use('/feedback', feedbackRouter);
router.use('/category', categoryRouter);

module.exports = router;