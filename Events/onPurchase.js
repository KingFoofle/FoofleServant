// Emitted whenever the user can afford the product
// Assume that the member and product exist in the database
module.exports = async (client, member, product) => {
	// TODO: Check if it saves
	const { userSchema:userDB } = client.database;
	userDB.findByIdAndUpdate(member.id, { $inc: { currency: -product.price } });

	// TODO: Check what kind of product it is, and perform a function
	// Product handling?
	// if product.name === 'something'{ productSomething() }
};