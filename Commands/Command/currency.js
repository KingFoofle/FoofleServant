module.exports.execute = async (client, message) => {
	const { author } = message;
	const { userSchema: userDB } = client.database;

	const member = message.mentions.members.first();
	let target;

	// If no @ mention was included, use the author
	if (!member) {target = author;}
	else { target = member.user;}

	// Find the target in the Database
	const foundUser = await userDB.findById(target.id);
	let reply;

	if (foundUser) {
		let balance;
		if (foundUser.currency) {balance = foundUser.currency;}

		else {
			balance = 0;
			client.logger.warn(`${target.username} does not have a currency field!`);
		}

		reply = `${target.username}'s balance: ${balance}`;

	}

	else {
		reply = `${target.username} is not registered!`;
		client.logger.warn(reply);
	}
	message.reply(reply);
};