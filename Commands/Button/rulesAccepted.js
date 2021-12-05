

module.exports.execute = async (client, interaction) => {
	const { giveRole } = client.tools;
	const { memberRoleId } = client.config;
	const message = 'Thank you for confirming!\nWelcome to the server!';
	giveRole(interaction.member, memberRoleId);
	return interaction.reply({ content: message, ephemeral: true });
};
