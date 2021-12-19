module.exports.execute = async (client, message) => {
	const { author } = message,
		{ userSchema: userDB } = client.database,
		member = message.mentions.members.first();

	let target;

	// If no @ mention was included, use the author
	if (!member) {target = author;}
	else { target = member.user;}

	// Find the target in the Database
	const foundUser = await userDB.findById(target.id);
	const reply = foundUser ?
		`${target.username}'s balance: ${foundUser.currency}` :
		`${target.username} is not registered!`;

	if (foundUser) {client.logger.warn(reply);}
	message.reply(reply);
};