module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(interaction);
		// Handle Commands and Buttons
		if (interaction.isCommand() || interaction.isButton()) {
			const command =
				interaction.client.commands.get(interaction.commandName) ||
				interaction.client.buttonCommands.get(interaction.customId);

			if (command) {
				console.log(
					`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction`,
				);
				try {
					// Calls files' execute method.
					// All js files under /commands should have one
					command.execute(interaction);
				}
				catch (error) {
					console.error(error);
					interaction.reply({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		}
		else { return; }
	},
};
