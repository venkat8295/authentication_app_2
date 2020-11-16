var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  image_id: String,
	comments:
	{
		data:String,
		comments_name: String,
		comments_email: String,
		comments_image_name: String
	}
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
