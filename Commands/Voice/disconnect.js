/**
 * Disconnect the Bot from the voice channel
 * @param {import('discord.js').Client} client The Discord Client
 */
exports.execute = async (client) => {
	client.music.disconnect();
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
// eslint-disable-next-line no-unused-vars
exports.canBeUsedBy = (client, member) => {
	// Anyone can use this command
};