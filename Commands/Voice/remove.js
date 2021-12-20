/**
 * Remove a song from the queue
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {String} index The zero-based position of the song to remove
 * @param {String} elementsToRemove How many songs after `index` should be removed. Default is 1
 */
exports.execute = async (client, message, index, elementsToRemove) => {
	const num = parseInt(index);
	const toRemove = parseInt(elementsToRemove);

	if (num > 0) {client.music.remove(num, toRemove > 0 ? toRemove : 1);}
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