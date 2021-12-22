/**
 * Retrieve and send the currency of a user.
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 */
module.exports.execute = async (client, message) => {
	const { author } = message,
		{ createEmbed } = client.tools,
		{ userSchema: userDB } = client.database,
		member = message.mentions.members.first(),
		// If no @ mention was included, use the author
		target = !member ? author : member.user,
		embed = createEmbed();

	// Find the target in the Database
	try {
		const user = await userDB.findById(target.id);
		embed.addField(`${target.username}'s balance`, `${user.currency}`);
	}

	catch {
		embed.addField('Error', `No currency found for ${target.username}`);
	}

	message.reply({ embeds: [embed] });

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