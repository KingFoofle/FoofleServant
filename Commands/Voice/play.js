/**
 * The command for Play and Playlist to use
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {String} functionToUse
 * @param {String} searchOrLink
 */
exports.play = async (client, message, functionToUse, searchOrLink) => {
	const { player, logger } = client,
		// Check if there was a queue beforehand
		queuePresent = !!player.getQueue(message.guildId),

		// Create or get the queue of the Guild
		queue = player.createQueue(message.guildId, {
		// Assign the text channel to the queue
			data: { message },
		});

	// Create or get the Connection to the voice channel
	await queue.join(message.member.voice.channel);

	// Emit the clientConnect event
	if (!queuePresent) {player.emit('clientConnect', queue, queue.connection.channel);}

	// Add the Song to the queue, passing in the arguments as a parameter
	if (functionToUse === 'play') {
		queue.play(searchOrLink)
			.catch(err => {
				logger.error(err);
				if (!queuePresent) queue.stop();
			});
	}

	else {
		queue.playlist(searchOrLink)
			.catch(err => {
				logger.error(err);
				if (!queuePresent) queue.stop();
			});
	}
};

/**
 * Play a song
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {...String} otherArgs The other arguments passed in by the user
 */
exports.execute = async (client, message, ...otherArgs) => {
	this.play(client, message, 'play', otherArgs.join(' '));
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