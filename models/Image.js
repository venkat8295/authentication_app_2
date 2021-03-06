var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	name: String,
	desc: String,
	file_name: String,
	username:String,
	email:String,
	img:
	{
		data: Buffer,
		contentType: String
	},
	comments:
	{
		_id: String,
		data:String,
		comments_name: String,
		comments_email: String,
		comments_image_name: String
	},
	replies:{
		comments_id: String,
		_id: String,
		name: String,
		email: String,
		reply: String,
		image_response: String
	}
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
