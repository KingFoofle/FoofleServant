/**
 * Retrieve and send the currency of a user.
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 */
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

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
// eslint-disable-next-line no-unused-vars
exports.canBeUsedBy = (client, member) => {
	// Anyone can use this command
};