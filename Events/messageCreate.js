/**
 * Emitted whenever a message is created.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The created message
 */
module.exports = async (client, message) => {
	const { author: user, content } = message,
		{ logger } = client,
		{ userSchema:userDB } = client.database,
		{ PREFIX } = client.env,
		{ userToMember } = client.tools,
		{ commandTypes } = client.constants,

		// Turn the User into a Member
		member = await userToMember(user);

	// Don't do anything with bot messages
	if (user.bot) { return; }

	// User sent a non-slash command!
	if (content.startsWith(PREFIX)) {
		// Remove the prefix, trim both sides, THEN split by " "
		// / +/g means ALL spaces
		const args = message.content.slice(PREFIX.length).trim().split(/ +/g),

			// Shift() removes and returns the 0th index of an array
			commandName = args.shift(),
			acceptedCommandTypes = [commandTypes.COMMAND, commandTypes.VOICE];

		// Search for a valid command
		let command;
		for (const cmdType of acceptedCommandTypes) {
			command = client.commands.get(cmdType).get(commandName);
			if (command) {break;}
		}


		// A command was found
		if (command) {

			// The command can be used if:
			// - The file did not define its restrictions
			// - The function did not return a reason why we can't use it
			let reason;
			if (command.canBeUsedBy) reason = command.canBeUsedBy(client, member);

			// Check if the member can use the command
			if (reason) {message.reply(`You cannot use this command!\nReason: ${reason}`);}

			else {
				logger.cmd(`${user.tag} in #${message.channel.name} triggered a prefix command: ${commandName}`);
				// ...args means we unpack the array as parameters
				command.execute(client, message, ...args).catch(logger.error);
			}
		}
	}

	const data = {
		_id: user.id,
		username: user.username,
		$inc:{ currency:1 },
	};

	// Upsert creates a new user if one isn't found
	// Increase the User's currency
	await userDB.findByIdAndUpdate(user.id, data, { upsert: true, setDefaultsOnInsert: true });
};
