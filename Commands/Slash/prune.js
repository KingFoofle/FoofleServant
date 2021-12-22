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
		{ logger, tools } = client,
		embed = tools.createEmbed();

	if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		embed.setTitle('You cannot use this command!')
			.addField('Reason', 'Insufficient Permissions');
	}

	else if (amount < 1) {
		embed.addField('Pruning Failed', 'You need to input an amount larger than 0');
	}
	else {
		try {
			const deletedMessages = await interaction.channel.bulkDelete(amount, true);
			embed.addField('Messages Deleted', `${deletedMessages.size}`);
		}

		catch (err) {
			logger.error(err);
			embed.addField('Error', err);
		}
	}

	interaction.reply({
		embeds: [embed],
		ephemeral:true,
	});
};
