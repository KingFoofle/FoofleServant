/**
 * Play a Playlist
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {...String} otherArgs The other arguments passed in by the user
 */
exports.execute = async (client, message, ...otherArgs) => {
	require('./play.js').play(client, message, 'playlist', otherArgs.join(' '));
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