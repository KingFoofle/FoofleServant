const { giveRole } = require('../../functions/giveRole');
const { memberRoleId } = require('../../config.json');

module.exports = {
	buttonName: 'rulesAccepted',
	async execute(interaction) {
		const message = 'Thank you for confirming!\nWelcome to the server!';
		giveRole(interaction, memberRoleId);
		return interaction.reply({ content: message, ephemeral: true });
	},
};
