const { SlashCommandBuilder } = require('@discordjs/builders');

exports.data = new SlashCommandBuilder()
	.setName('give_coins')
	.setDescription('Give FoofCoins to a User')
	.addUserOption((option) =>
		option
			.setName('target')
			.setDescription('The member to give FoofCoins to')
			.setRequired(true))
	.addIntegerOption((option) =>
		option
			.setName('amount')
			.setDescription('The amount of FoofCoins to give')
			.setRequired(true));


exports.execute = async (client, interaction) => {
	const target = interaction.options.getMember('target'),
		amount = interaction.options.getInteger('amount'),
		{ logger } = client,
		{ member } = interaction,
		{ userSchema:userDb } = client.database;

	let reason;
	let success;

	// No transfering to yourself!
	if (member.id === target.id) {reason = 'You cannot transfer to yourself';}

	else {
		try {
		// Grab the user from the database
			member.dbUser = await userDb.findById(member.id);
			target.dbUser = await userDb.findById(target.id);
			if (!target.dbUser) {reason = 'Target is not registered.';}

			else if (member.dbUser) {
				if (member.dbUser.currency < amount) {reason = 'Insufficient funds.';}
				else {
					await userDb.findByIdAndUpdate(member.id, { $inc: { currency: -amount } });
					await userDb.findByIdAndUpdate(target.id, { $inc: { currency: amount } });
					success = true;
				}
			}

			else {
				reason = 'You might not be registered. Please contact KingFoofle.';
				logger.warn(`${member.user.username} might not be registered!`);
			}
		}

		catch (err) {
			reason = 'Error. Please try again later.';
			logger.error(err);
		}
	}

	const message = success ?
		`Transfered ${amount} to ${target.user.username}.` :
		`Could not complete transaction.\nReason: ${reason}`;

	return interaction.reply({ content: message, ephemeral: true });
};