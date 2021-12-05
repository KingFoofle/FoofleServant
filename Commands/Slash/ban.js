const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption((option) =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName('reason')
			.setDescription('Reason for banning this user.'))

module.exports.execute = async (client, interaction) => {
	const { logToAdminChannel } = client.tools;
	const logger = client.logger;
	const member = interaction.options.getMember('target');
	const reason = interaction.options.getString('reason');
	let message;

	if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
		message = `You banned: ${member}`;
		if (reason) {
			message += `\nReason: ${reason}`;
		}
		if (member.bannable) {
			// Ban and delete 7 days worth of messages
			member
				.ban({ days: 7, reason: reason })
				.then(logger.log)
				.catch(logger.error);
			logToAdminChannel(interaction, message);
		}
		else {
			message = `You cannot ban ${member.user.username}!\nReason: Unbannable`;
		}
	}
	else {
		message = `You cannot ban ${member.user.username}!\nReason: Insufficient Permissions`;
	}
	return interaction.reply({ content: message, ephemeral: true });

};
