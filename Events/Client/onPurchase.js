// Emitted whenever the user can afford the product
// Assume that the member and product exist in the database
module.exports = async (client, interaction, product) => {
	const { userSchema:userDB } = client.database,
		{ commands, logger } = client,
		{ commandTypes } = client.constants,
		{ member } = interaction,
		user = await userDB.findById(member.id),
		command = commands.get(commandTypes.PRODUCT).get(product._id);

	const embed = client.tools.createEmbed();

	// User cannot afford this product
	if (user.currency < product.price) {embed.addField('Purchase Failed', 'You cannot afford this product');}

	else {
		try {
			// Execute the command
			const result = await command.execute(client, interaction, product);

			// The command dictates why the purchase has failed
			if (result && result.reason) {
				embed.addField('Purchase Failed', result.reason)
					.addField('\u200B', 'You have not been charged for this purchase');
			}

			else {
				// If we are here, it means that the command did its job and we should charge the user
				embed.addField('Purchase success', 'Thank you for shopping at the Foof Store');
				await userDB.findByIdAndUpdate(member.id, { $inc: { currency: -product.price } });
			}
		}
		catch (err) {
			embed.addField('An error has occurred', err.message)
				.addField('\u200B', 'You have not been charged for this purchase');
			logger.error(err);
		}
	}

	interaction.reply({ embeds:[embed], ephemeral:true });
};