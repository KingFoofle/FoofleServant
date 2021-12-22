/**
 * Remove a song from the queue
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {String} index The zero-based position of the song to remove
 */
exports.execute = async (client, message, index) => {
	const num = parseInt(index);
	if (num) {client.player.getQueue(message.guildId).remove(num);}

	// TODO: Reply to the channel
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