var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedBackSchema = new Schema({
    text: {type: String},
    category_id: {type: Schema.Types.ObjectId},
    ip: String,
    create_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('FeedBack', FeedBackSchema);