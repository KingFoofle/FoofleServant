const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToAdminChannel } = require('../functions/logToAdminChannel');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('options-info')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('input').setDescription('The input to echo back')),
	async execute(interaction) {
		const value = interaction.options.getString('input');
		if (value) {
			logToAdminChannel(interaction, `The options value is: \`${value}\``);
			return interaction.reply(`The options value is: \`${value}\``);
		}
		return interaction.reply('No option was provided!');
	},
};
