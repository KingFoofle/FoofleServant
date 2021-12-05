const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.data = new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Select a member and kick them.')
	.addUserOption((option) =>
		option
			.setName('target')
			.setDescription('The member to kick')
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName('reason')
			.setDescription('Reason for kicking this user.'),
	);
	
module.exports.execute = async (client, interaction) => {
	const { logToAdminChannel } = client.tools;
	const member = interaction.options.getMember('target');
	const message = `You kicked: ${member.user.username
		}\nReason: ${interaction.options.getString('reason')}`;
	member.kick();
	logToAdminChannel(interaction, message);
	return interaction.reply({ content: message, ephemeral: true });

};
