/**
	* Give the user a Blue Nickname
	* @param {import('discord.js').Client} client The Discord Client
	* @param {import('discord.js').ButtonInteraction} interaction The Button Interaction triggered by the Member
	* @param {import('mongoose').Model} product The Product that the Member purchased
*/
module.exports.execute = async (client, interaction, product, color = 'blue') => {
	const { hasRole, giveColor } = client.tools;
	if (hasRole(interaction.member, color)) {return { reason: 'User already has this color' };}
	giveColor(interaction.member, color);
};
