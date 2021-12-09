const { SlashCommandBuilder } = require('@discordjs/builders');

exports.data = new SlashCommandBuilder()
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

exports.execute = async (client, interaction) => {
	const member = interaction.options.getMember('target'),
		message = `You kicked: ${member.user.username
		}\nReason: ${interaction.options.getString('reason')}`;

	member.kick();
	return interaction.reply({ content: message, ephemeral: true });

};
