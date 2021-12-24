const { execute } = require('./blueNickname');
/**
	* Give the user a Cyan Nickname
	* @param {import('discord.js').Client} client The Discord Client
	* @param {import('discord.js').ButtonInteraction} interaction The Button Interaction triggered by the Member
	* @param {import('mongoose').Model} product The Product that the Member purchased
*/
module.exports.execute = async (client, interaction, product) => {
	return execute(client, interaction, product, 'cyan');
};