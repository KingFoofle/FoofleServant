/**
 * Remove a song from the queue
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {String} index The zero-based position of the song to remove
 */
exports.execute = async (client, message, index) => {
	const num = parseInt(index);
	const queue = client.player.getQueue(message.guildId);
	if (num && queue) {
		// TODO: Reply to the channel
		queue.remove(num);
	}

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

exports.description = 'Remove a song from the Queue.';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$remove [Song_Position]';