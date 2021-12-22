// Emitted whenever the user can afford the product
// Assume that the member and product exist in the database
module.exports = async (client, interaction, product) => {
	const { userSchema:userDB } = client.database,
		{ commands, logger } = client,
		{ commandTypes } = client.constants,
		{ member } = interaction,
		user = await userDB.findById(member.id),
		command = commands.get(commandTypes.PRODUCT).get(product._id);

	let message;

	// User cannot afford this product
	if (user.currency < product.price) {message = 'You cannot afford this purchase!';}

	else {
		try {
			// Execute the command
			await command.execute(client, interaction, product);
			// If we are here, it means that the command did its job and we should charge the user
			await userDB.findByIdAndUpdate(member.id, { $inc: { currency: -product.price } });
			message = 'Your purchase has been successful!';
		}
		catch (err) {
			message = 'An Error has Occurred. You have not been charged for this purchase.';
			logger.error(err);
		}
	}

	interaction.reply({ content:message, ephemeral:true });
};