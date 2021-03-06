/**
 *
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {...any} otherArgs The arguments passed in by the user
 */
exports.execute = async (client, message, volume) => {
	const vol = parseInt(volume);
	const queue = client.player.getQueue(message.guildId);
	if (vol && queue) {queue.setVolume(vol);}
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

exports.description = 'Set the volume of the music';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$volume [vol]';