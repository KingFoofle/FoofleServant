module.exports.execute = async (client, message, index, elementsToRemove) => {
	const num = parseInt(index);
	const toRemove = parseInt(elementsToRemove);

	if (num > 0) {client.music.remove(num, toRemove > 0 ? toRemove : 1);}
};

exports.canBeUsedBy = (client, member) => {
	if (!client.tools.voiceVerification(member)) {
		return { reason: 'Not Connected to a Voice Channel!' };
	}
};