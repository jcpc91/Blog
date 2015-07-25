var mongoose = require('mongoose');

var Usuario = new mongoose.Schema({
	_id: {type: String, required: true},
	token : {type: String, maxlength: 100},
	username: {type: String, maxlength: 50},
	displayname: {type: String, maxlength: 100},
	photos: {type: [{
		val: {type: String, maxlength: 200}
	}]},
	provider: {type: String, maxlength: 30},
	access: {type: Boolean, required: true}
},{
	collection: 'users'
});

Usuario.methods.validar = function(profile){
	return this.model('Usuario').findOne({_id: profile.id});
	
};

module.exports = mongoose.model('Usuario', Usuario);