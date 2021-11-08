const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('creates temp button'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('I accept')
					.setStyle('SUCCESS')
					.setCustomId('rulesAccepted'),

				new MessageButton()
					.setCustomId('primary')
					.setLabel('I do not accept')
					.setStyle('DANGER')
					.setCustomId('rulesDeclined'),
			);

		await interaction.reply({ content: 'I accept the rules', components: [row] });
	},
};
