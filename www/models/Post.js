var mongoose = require('mongoose');

var Post = new mongoose.Schema({
    titulo: {type : String, required: true, maxlength: 150},
    introduccion: {type: String, maxlength: 170},
    html: String,
    fecha: Date,
    tags: { type : [String]},
    publish: {type: Boolean, default: false}
});

module.exports = mongoose.model('Post', Post);