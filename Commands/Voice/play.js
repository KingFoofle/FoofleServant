/**
 * Disconnect the Bot from the voice channel
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {...String} otherArgs The other arguments passed in by the user
 */
exports.execute = async (client, message, ...otherArgs) => {
	/** @type {import('discord-music-player').Player} */
	const player = client.player,
		{ logger } = client,

		// Check if there was a queue beforehand
		guildQueue = player.getQueue(message.guildId),

		// Create or get the queue of the Guild
		queue = player.createQueue(message.guildId);

	// Assign the text channel to the queue
	queue.data = { message: message };

	// Create or get the Connection to the voice channel
	await queue.join(message.member.voice.channel);

	// Add the Song to the queue, passing in the arguments as a parameter
	queue.play(otherArgs.join(' '))
		.catch(err => {
			logger.error(err);
			if (!guildQueue) queue.stop();
		});
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	if (!client.tools.isConnectedToVoiceChannel(member)) {
		return 'Not Connected to a Voice Channel!';
	}
};