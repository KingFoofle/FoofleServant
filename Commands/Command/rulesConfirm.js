const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.execute = async (client, message) => {
	const { foofleId } = client.config;

	// Can only be used by Foofle
	if (message.author.id !== foofleId) return;
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
