/**
 * Logic to run when the user presses the `rulesDeclined` button
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').ButtonInteraction} interaction The Button Interaction triggered by the user
 */
module.exports.execute = async (client, interaction) => {
	const message = 'Well, you\'re going to have to :)';
	return interaction.reply({ content: message, ephemeral: true });
};