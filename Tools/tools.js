
// Functions
module.exports.giveRole = (member, roleID) => {
	member.roles.add(roleID);
}

module.exports.logToAdminChannel = (client, message) => {
	// Maybe use a constant time zone?
	message = `*${new Date().toLocaleString()}:*\n${message}`;
	client.channels.cache.get(client.config.logChannelId).send(message);
}

// Constants
module.exports.commandTypes = {
    SLASH: "Slash",
    COMMAND: "Command",
    BUTTON: "Button"
}

module.exports.emojiToRoles = {
	// 🎉 -> Events
    '🎉' : "907388202682298398"
}

module.exports.customEmojiIdToRoles = {
	// None
}
