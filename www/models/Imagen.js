var moongose = require('mongoose');

var Imagen = new moongose.Schema({
	Key: {type: String, required: true, maxlength: 100},
	nombreOriginal: {type: String, required: true, maxlength: 100},
	mimetype: {type: String, required: true, maxlength: 40},
	link: {type: String, required: true, maxlength: 500},
	extension:{type: String, required: true, maxlength: 500},
	bucket: {type: String, maxlength: 20},
	etag: {type: String, maxlength: 50},
	fecha: {type: Date}
},{
	collection: 'imagens'
});

module.exports = moongose.model('Imagen', Imagen);