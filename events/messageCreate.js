module.exports = async (client, message) => {
	const { author: user, content } = message,
		{ logger } = client,
		{ PREFIX } = client.env,
		{ commandTypes } = client.tools;

	// Don't do anything with bot messages
	if (user.bot) { return; }

	// User sent a non-slash command!
	if (content.startsWith(PREFIX)) {
		// Remove the prefix, trim both sides, THEN split by " "
		// / +/g means ALL spaces
		const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

		// Shift() removes and returns the 0th index of an array
		const commandName = args.shift();

		const command = client.commands.get(commandTypes.COMMAND).get(commandName);
		try {
			if (command) {
				logger.cmd(`${user.tag} in #${message.channel.name} triggered a prefix command: ${commandName}`);
				// ...args means we unpack the array as parameters
				command.execute(client, message, ...args);
			}
		}
		catch (error) {
			logger.error(error);
		}
	}

	const data = { _id: user.id, username: user.username, $inc:{ currency:1 } };

	// Upsert creates a new user if one isn't found
	// Increase the User's currency
	await client.database.userSchema.findByIdAndUpdate(user.id, data, { upsert: true, setDefaultsOnInsert: true });


};
