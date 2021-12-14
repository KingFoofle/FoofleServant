module.exports.execute = async (client, message) => {
	const { author } = message,
		{ music } = client,
		member = await client.tools.getMemberFromUserId(client, author.id),
		{ voice: voiceState } = member;

	if (!voiceState) {return message.reply('You are not connected to a voice channel!');}
	music.stop();
};