// Functions

/**
 * Assigns the roleName parameter to member, if said role exists
 * @param {GuildMember} member
 * @param {String} roleName
 */
exports.giveRole = (member, roleName) => {
	const { roles, guild, client, user } = member;
	const role = guild.roles.cache.find(r => r.name === roleName);
	if (role) {
		roles.add(role.id);
		client.logger.event(`Gave ${user.username} role: ${role.name}`);
	}

	else {
		client.logger.warn(`${guild.name} does not have a role named: ${roleName}`);
	}
};

// TODO: Update this. client.config doesn't exist, and I'm sure message.client is a thing
exports.logToAdminChannel = (client, message) => {
	// Maybe use a constant time zone?
	message = `*${new Date().toLocaleString()}:*\n${message}`;
	client.channels.cache.get(client.config.logChannelId).send(message);
};

// Constants
exports.commandTypes = {
	SLASH: 'Slash',
	COMMAND: 'Command',
	BUTTON: 'Button',
};

exports.emojiToRoleName = {
	// 🎉 -> Events
	'🎉': 'Events',
};

exports.customEmojiIdToRoleName = {
	// None
};
