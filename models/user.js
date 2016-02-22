var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, unique: true},
    password: {type: String},
    level: {type: String},
    create_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);