

module.exports.execute = async (client, interaction) => {
	const { giveRole } = client.tools;
	const message = 'Thank you for confirming!\nWelcome to the server!';
	giveRole(interaction.member, "Member");
	return interaction.reply({ content: message, ephemeral: true });
};
