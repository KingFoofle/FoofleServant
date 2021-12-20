/**
 * Disconnect the Bot from the voice channel
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param {...String} otherArgs The other arguments passed in by the user
 */
exports.execute = async (client, message, ...otherArgs) => {
	const { member, channel:textChannel } = message,
		{ music } = client,
		{ voice: voiceState } = member;

	let url, query;
	const linkOrSearchQuery = otherArgs.join(' '),
		{ channel: voiceChannel } = voiceState;

	if (!linkOrSearchQuery) {return message.reply('No URL or SearchQuery was passed!');}


	// Determine if the argument is a youtube link or a query
	if (music.validateURL(linkOrSearchQuery)) {url = linkOrSearchQuery;}
	else {query = linkOrSearchQuery;}

	if (voiceChannel.joinable) {
		const connectOptions = { textChannel: textChannel, voiceChannel: voiceChannel };
		return music.play({ url: url, query: query }, connectOptions);
	}

	message.reply('I cannot join this voice channel!');


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