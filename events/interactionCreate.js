module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!interaction.isCommand()) return;
		if (!command) return;
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction: ${interaction.commandName}`);
		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
