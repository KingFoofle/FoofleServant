const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Select a member and unban them. Need an ID')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member ID to unban')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Reason for unbanning this user.'),
		),
	async execute(interaction) {
		// TODO: Only unban if they are banned
		const id = interaction.options.get('target')?.value;
		const reason = interaction.options.getString('reason');
		let message = `You unbanned user with ID: ${id}`;
		if (reason) {
			message += `\nReason: ${reason}`;
		}
		interaction.guild.members.unban(id);
		return interaction.reply({ content: message, ephemeral: true });
	},
};
