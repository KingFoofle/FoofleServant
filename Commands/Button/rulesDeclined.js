module.exports.execute = async (client, interaction) => {
	const message = 'Well, you\'re going to have to :)';
	return interaction.reply({ content: message, ephemeral: true });
};