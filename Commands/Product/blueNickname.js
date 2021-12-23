/**
	* Give the user a Blue Nickname
	* @param {import('discord.js').Client} client The Discord Client
	* @param {import('discord.js').ButtonInteraction} interaction The Button Interaction triggered by the Member
	* @param {import('mongoose').Model} product The Product that the Member purchased
*/
exports.execute = async (client, interaction, product) => {
	return this.colorCmd(client, interaction, 'blue');
};

exports.colorCmd = async (client, interaction, color) => {
	const { hasRole, giveColor } = client.tools;
	if (hasRole(interaction.member, color)) {return { reason: 'User already has this color' };}
	giveColor(interaction.member, color);
};