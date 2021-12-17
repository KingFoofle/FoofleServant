module.exports.execute = async (client, message, ...otherArgs) => {
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