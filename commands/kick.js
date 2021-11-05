const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them.')
		.addUserOption(option => option.setName('target').setDescription('The member to kick'))
		.addStringOption(option => option.setName('reason').setDescription('Reason for kicking this user.').setRequired(false)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		member.kick();
		return interaction.reply({ content: `You kicked: ${member.user.username}\nReason: ${interaction.options.getString('reason')}`, ephemeral: true });
	},
};
