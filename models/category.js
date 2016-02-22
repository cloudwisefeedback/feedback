var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {type: String},
    feedback_count: {type: Number, default: 0},
    user_id: {type: Schema.Types.ObjectId},
    create_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Category', CategorySchema);