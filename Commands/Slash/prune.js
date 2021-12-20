const { SlashCommandBuilder } = require('@discordjs/builders'),
	{ Permissions } = require('discord.js');

exports.data = new SlashCommandBuilder()
	.setName('prune')
	.setDescription('Prune a specified number of 14 day-old messages.')
	.addIntegerOption((option) =>
		option
			.setName('amount')
			.setDescription('Number of messages to prune')
			.setRequired(true),
	);

/**
 * Prune a specified number of 14 day-old messages
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').CommandInteraction} interaction The Slash Command Interaction triggered by the user
 */
exports.execute = async (client, interaction) => {
	const amount = interaction.options.getInteger('amount'),
		{ logger } = client;

	let message;
	if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		message = 'You cannot use this command!\nReason: Insufficient Permissions';
	}

	else if (amount < 1) {message = 'You need to input a number higher than 0.';}
	else {
		try {
			const deletedMessages = await interaction.channel.bulkDelete(amount, true);
			message = `Successfully pruned \`${deletedMessages.size}\` messages.`;
		}

		catch (err) {
			logger.error(err);
			message = 'There was an error trying to prune messages in this channel!';
		}
	}

	interaction.reply({
		content: message,
		ephemeral:true,
	});
};
