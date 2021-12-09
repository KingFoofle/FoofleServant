const userSchema = require('./Schema/User.js');

// Create/find users Database
module.exports.fetchUser = async function(id) {

	let user = await userSchema.findOne({ _id: id });
	if (user) {
		return user;
	}

	// User was not found. Create it
	else {
		user = new userSchema({
			_id: id,
		});
		await user.save().catch(err => console.log(err));
		return user;
	}
};