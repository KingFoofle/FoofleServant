module.exports = async (client, message) => {
	const { author: user, content, channel } = message,
		{ logger } = client,
		{ PREFIX, GUILD_ID } = client.env,
		{ commandTypes } = client.tools,

		// Turn the User into a Member
		// TODO: When this branch is merged with VOICE, replace this with the function in TOOLS.js
		member = client.guilds.cache.get(GUILD_ID).members.cache.get(user.id);

	// Don't do anything with bot messages
	if (user.bot) { return; }

	// User sent a non-slash command!
	if (content.startsWith(PREFIX)) {
		// Remove the prefix, trim both sides, THEN split by " "
		// / +/g means ALL spaces
		const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

		// Shift() removes and returns the 0th index of an array
		const commandName = args.shift();

		// eslint-disable-next-line no-inline-comments
		const acceptedCommandTypes = [commandTypes.COMMAND, commandTypes.ADMIN, commandTypes.VOICE];

		// Determine what kind of type the command is
		// Supported Types are listed above
		let command, commandType;
		for (const cmdType of acceptedCommandTypes) {
			command = client.commands.get(cmdType).get(commandName);
			if (command) {
				// eslint-disable-next-line no-unused-vars
				commandType = cmdType;
				break;
			}
		}

		try {
			// A command was found
			if (command) {

				logger.cmd(`${user.tag} in #${message.channel.name} triggered a prefix command: ${commandName}`);
				// ...args means we unpack the array as parameters
				command.execute(client, message, ...args);

				// The command can be used if:
				// - The file did not define its restrictions
				// - The member meets all the criteria to use the command
				const canBeUsed = !command.canBeUsed || command.canBeUsedBy(member);

				// TODO: Add a Reason depending on the category of the command (ADMIN/VOICE)

				if (canBeUsed) {
					logger.cmd(`${user.tag} in #${message.channel.name} triggered a prefix command: ${commandName}`);
					// ...args means we unpack the array as parameters
					command.execute(client, message, ...args);
				}

				else {channel.reply('You cannot use this command! Reason: Invalid Permissions');}
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
