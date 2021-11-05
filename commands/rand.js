const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rand')
		.setDescription('Randomize a number between a and b (inclusive).')
		.addIntegerOption(option =>
			option
				.setName('a')
				.setDescription('Lower bound to randomize between.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('b')
				.setDescription('Upper bound to randomize between.')
				.setRequired(true)),
	async execute(interaction) {
		const a = interaction.options.getInteger('a');
		const b = interaction.options.getInteger('b');
		const number = Math.floor(Math.random() * (b - a) + a);
		return interaction.reply({ content: number.toString(), ephemeral: true });
	},
};
