module.exports = async (client, reaction, user) => {
    const logger = client.logger;
    const message = reaction.message;
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error(`Something went wrong when fetching the message: ${error}`)
            // Return as some properties may be undefined/null
            return;
        }
    }
    const { reactionMessageId } = client.config;
    const { giveRole, emojiToRoleName, customEmojiIdToRoleName } = client.tools;

    // Here we assign roles!
    if (message.id === reactionMessageId) {
        let roleName = emojiToRoleName[reaction.emoji] || customEmojiIdToRoleName[reaction.emoji.id];

        // There is no direct way to go from User to GuildMember
        // So what we do is access the guild that the reaction is coming from
        // and obtain the GuildMember via ID
        const member = reaction.message.guild.members.cache.get(user.id);
        if (roleName) {
            giveRole(member, roleName);
        }
    }

    // Now the message has been cached and is fully available

}