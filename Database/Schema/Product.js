const mongoose = require('mongoose');

module.exports = mongoose.model('Product', new mongoose.Schema({
	// ID of the product. Preferably the name of the Product.
	_id: String,

	description: {
		type: String,
		required: [true, 'Product needs to have a description.'],
	},

	// The price of the Product
	price: {
		type: Number,
		default: 0,
		min: [0, 'Price cannot be smaller than 0.'],
	},

	// The Image URL of the Product
	image: { type: String },
}));