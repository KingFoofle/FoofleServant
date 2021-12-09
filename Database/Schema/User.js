const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
	// ID of the user
	_id: { type: String },

	// Registration Time
	registeredAt: { type: Number, default: Date.now() },

	// The users' currency
	currency: { type: Number, default: 0 },
}));