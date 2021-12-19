module.exports.execute = async (client, message) => {
	const { author } = message,
		{ userSchema: userDB } = client.database,
		member = message.mentions.members.first(),
		// If no @ mention was included, use the author
		target = !member ? author : member.user;


	// Find the target in the Database
	userDB.findById(target.id)
		.then((foundUser) => message.reply(`${target.username}'s balance: ${foundUser.currency}`))
		.catch(() => message.reply(`No currency found for ${target.username}`));

};