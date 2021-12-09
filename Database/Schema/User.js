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
}));