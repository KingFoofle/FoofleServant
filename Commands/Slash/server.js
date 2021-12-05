const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.data = new SlashCommandBuilder()
	.setName('server')
	.setDescription('Display info about this server.');

module.exports.execute = async (client, interaction) => {
	return interaction.reply(
		`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
	);
};
