module.exports.execute = async (client) => {
	client.music.pause();
};

exports.canBeUsedBy = (client, member) => {
	if (!client.tools.voiceVerification(member)) {
		return { reason: 'Not Connected to a Voice Channel!' };
	}
};