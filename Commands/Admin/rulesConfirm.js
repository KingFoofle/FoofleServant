const { MessageActionRow, MessageButton } = require('discord.js');

/**
 * Send 2 buttons: `rulesAccepted` and `rulesDeclined` to the channel
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 */
module.exports.execute = async (client, message) => {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel('I accept')
			.setStyle('SUCCESS')
			.setCustomId('rulesAccepted'),

		new MessageButton()
			.setLabel('I do not accept')
			.setStyle('DANGER')
			.setCustomId('rulesDeclined'),
	);

	await message.channel.send({
		content: 'I accept the rules',
		components: [row],
	});

};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	// Can only be used by Foofle
	if (member.id !== client.env.OWNER_ID) {
		return 'Insufficient Permissions';
	}
};
