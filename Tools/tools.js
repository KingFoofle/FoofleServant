
// Functions
module.exports.giveRole = (member, roleName) => {
	const { roles, guild, client, user } = member;
	let role = guild.roles.cache.find(r => r.name === roleName);
	if (role){
		roles.add(role.id);
		client.logger.event(`Gave ${user.username} role: ${role.name}`);
	}

	else{
		client.logger.warn(`${guild.name} does not have a role named: ${roleName}`);
	}
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

module.exports.emojiToRoleName = {
	// 🎉 -> Events
	'🎉': "Events"
}

module.exports.customEmojiIdToRoleName = {
	// None
}
