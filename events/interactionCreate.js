module.exports = async (client, interaction) => {
	const { commands, logger } = client,
		{ commandTypes } = client.tools;

	let command, commandList, logMessage, logType;

	// Handle Slash Commands Interactions
	if (interaction.isCommand()) {
		commandList = commands.get(commandTypes.SLASH);
		command = commandList.get(interaction.commandName);
		logMessage = `used a slash command: ${interaction.commandName}`;
		logType = logger.cmd;
	}

	// Handles Button Interactions
	// Custom ID must be set to the Button File's name
	else if (interaction.isButton()) {
		commandList = commands.get(commandTypes.BUTTON);
		command = commandList.get(interaction.customId);
		logMessage = `clicked a button: ${interaction.customId}`;
		logType = logger.event;
	}

	// What is even this interaction?
	else {
		return logger.warn(`Unknown Interaction: ${interaction.type}`);
	}

	// Check if the command exists
	if (command) {
		logType(
			`${interaction.user.tag} in #${interaction.channel.name} ${logMessage}`,
		);
		try {
			// Calls files' execute method.
			// All js files under /commands should have one
			command.execute(client, interaction);
		}
		catch (error) {
			logger.error(error);
			interaction.reply({
				content:
					'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}

};
