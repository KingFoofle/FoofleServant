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


/**
 * Give a specified user FoofCoins
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').CommandInteraction} interaction The Slash Command Interaction triggered by the user
 */
exports.execute = async (client, interaction) => {
	const target = interaction.options.getMember('target'),
		amount = interaction.options.getInteger('amount'),
		{ logger, tools } = client,
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

	const embed = tools.createEmbed();
	if (success) {embed.addField('Transfer Success', `Transfered ${amount} to ${target.user.username}.`);}
	else {embed.addField('Could not complete transaction', `Reason: ${reason}`);}

	return interaction.reply({ embeds: [embed], ephemeral: true });
};