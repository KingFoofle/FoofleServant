const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.data = new SlashCommandBuilder()
	.setName('prune')
	.setDescription('Prune a specified number of 14 day-old messages.')
	.addIntegerOption((option) =>
		option
			.setName('amount')
			.setDescription('Number of messages to prune')
			.setRequired(true),
	);

module.exports.execute = async (client, interaction) => {
	const amount = interaction.options.getInteger('amount');
	const logger = client.logger;

	if (amount < 1) {
		return interaction.reply({
			content: 'You need to input a number higher than 0.',
			ephemeral: true,
		});
	}

	await interaction.channel
		.bulkDelete(amount, true)
		.then((messages) =>
			interaction.reply({
				content: `Successfully pruned \`${messages.size}\` messages.`,
				ephemeral: true,
			}),
		)

		.catch((error) => {
			logger.error(error);
			interaction.reply({
				content:
					'There was an error trying to prune messages in this channel!',
				ephemeral: true,
			});
		});
};
