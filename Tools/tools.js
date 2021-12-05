module.exports.giveRole = (member, roleID) => {
	member.roles.add(roleID);
}

module.exports.logToAdminChannel = (client, message) => {
	// Maybe use a constant time zone?
	message = `*${new Date().toLocaleString()}:*\n${message}`;
	client.channels.cache.get(client.config.logChannelId).send(message);
}

module.exports.commandTypes = {
    SLASH: "Slash",
    COMMAND: "Command",
    BUTTON: "Button"
}