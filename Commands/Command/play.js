module.exports.execute = async (client, message, ...otherArgs) => {
	const { author } = message,
		{ music, logger } = client,
		member = await client.tools.getMemberFromUserId(client, author.id),
		{ voice: voiceState } = member;

	if (!otherArgs) {return message.reply('No URL or SearchQuery was passed!');}
	if (!voiceState) {return message.reply('You are not connected to a voice channel!');}

	const linkOrSearchQuery = otherArgs.join(' '),
		{ channel } = voiceState;

	// Connect the Bot to the Member's Voice Channel
	await music.joinVoiceChannel({
		channelId: channel.id,
	});

	// This either adds to the queue, or starts a new AudioPlayer
	const result = await music.play(linkOrSearchQuery);
	const { error, video, position } = result;
	let reply;
	if (error) {
		reply = error;
		logger.error(error);
	}

	// First in line!
	else if (position === 0) {
		reply = `Now playing: ${video.title} [${video.duration}]`;
	}
	else {
		reply = `Added: ${video.title} [${video.duration}] to the queue. Position: ${position}`;
	}

	message.reply(reply);
};