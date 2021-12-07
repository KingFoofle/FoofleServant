module.exports = async (client, message) => {
	const user = message.author;
	const content = message.content;
	const logger = client.logger;
	const { PREFIX } = client.env;
	const { commandTypes } = client.tools;

	// Don't do anything with bot messages
	if (message.author.bot) { return; }

	// User sent a non-slash command!
	if (content.startsWith(PREFIX)) {
		// Remove the prefix, THEN split by " "
		// / +/g means ALL spaces
		const args = message.content.slice(prefix.length).trim().split(/ +/g);

		// Shift() removes and returns the 0th index of an array
		const commandName = args.shift();

		const command = client.commands.get(commandTypes.COMMAND).get(commandName);
		try {
			if (command) {
				logger.cmd(`${user.tag} in #${message.channel.name} triggered a prefix command: ${commandName}`)
				// ...args means we unpack the array as parameters
				command.execute(client, message, ...args);
			}
		}
		catch (error) {
			logger.error(error);
		}
	}

};
