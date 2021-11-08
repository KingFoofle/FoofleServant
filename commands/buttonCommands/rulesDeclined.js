module.exports = {
	buttonName : 'rulesDeclined',
	async execute(interaction) {
		const message = 'Well, you\'re going to have to :)';
		return interaction.reply({ content: message, ephemeral: true });
	},
};
