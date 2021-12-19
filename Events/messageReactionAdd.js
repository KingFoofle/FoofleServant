module.exports = async (client, reaction, user) => {
	const { logger } = client;
	const { message, emoji } = reaction;

	if (user.bot) return;
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		}
		catch (error) {
			// Return as some properties may be undefined/null
			return logger.error(`Something went wrong when fetching the message: ${error}`);
		}
	}
	// Now the message has been cached and is fully available
	const { REACTION_MESSAGE_ID } = client.env;
	const { giveRole, emojiToRoleName, customEmojiIdToRoleName } = client.tools;

	// Here we assign roles!
	if (message.id === REACTION_MESSAGE_ID) {
		const roleName = emojiToRoleName[emoji] || customEmojiIdToRoleName[emoji.id];

		// There is no direct way to go from User to GuildMember
		// So what we do is access the guild that the reaction is coming from
		// and obtain the GuildMember via ID
		const member = message.guild.members.cache.get(user.id);
		if (roleName) {
			giveRole({ member: member, roleName: roleName });
		}
	}
};