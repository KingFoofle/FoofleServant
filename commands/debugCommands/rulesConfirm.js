const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name : '/rulesConfirm',
	async execute(message) {
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

		await message.channel.send({ content: 'I accept the rules', components: [row] });
	},
};
