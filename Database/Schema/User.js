const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
	// ID of the user
	_id: { type: String, required: true },

	// The Discord Username
	username: String,

	// Registration Time
	registeredAt: { type: Date, default: Date.now() },

	// The users' currency
	currency: { type: Number, default: 0 },

	// The users' inventory
	// Key: The name of the item
	// Value: The count of the item
	inventory: { type: Map, of: Number },
}));