module.exports.execute = async (client) => {
	client.music.skip();
};

exports.canBeUsedBy = (client, member) => {
	if (!client.tools.voiceVerification(member)) {
		return { reason: 'Not Connected to a Voice Channel!' };
	}
};