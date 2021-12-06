module.exports = async (client, reaction, user) => {
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            client.logger.load("Loading Reaction...");
            await reaction.fetch();
            client.logger.success("Reaction Loaded!");
        } catch (error) {
            client.logger.error(`Something went wrong when fetching the message: ${error}`)
            // Return as some properties may be undefined/null
            return;
        }
    }
    const { reactionMessageId } = client.config;
    const logger = client.logger;
    const { giveRole, emojiToRoles, customEmojiIdToRoles } = client.tools;
    const message = reaction.message;

    // Here we assign roles!
    if (message.id === reactionMessageId) {
        let role = emojiToRoles[reaction.emoji] || customEmojiIdToRoles[reaction.emoji.id];

        // There is no direct way to go from User to GuildMember
        // So what we do is access the guild that the reaction is coming from
        // and obtain the GuildMember via ID
        const member = reaction.message.guild.members.cache.get(user.id);
        if (role) {
            logger.event(`Gave ${user.username} role ID: ${role}`);
            giveRole(member, role);
        }
    }

    // Now the message has been cached and is fully available

}