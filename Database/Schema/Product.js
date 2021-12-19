const mongoose = require('mongoose');

module.exports = mongoose.model('Product', new mongoose.Schema({
	// ID of the product. Preferably the name of the Product.
	_id: String,

	description: String,

	// The price of the Product
	price: { type: Number, default: 0 },

	// The Image URL of the Product
	image: { type: String },
}));