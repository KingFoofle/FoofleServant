const { MessageEmbed } = require('discord.js');

/**
 * The Discord Client
 * @type {import('discord.js').Client}
 */
let client;

/**
 * Initialize the tools by giving them access to the `DiscordClient`
 * @param {import('discord.js').Client} c - The client for each tool to use
 */
exports.init = c => {
	client = c;
};

/**
 * Assign a Color role to the given guild member
 * @param {import('discord.js').GuildMember} member
 * @param {String} color
 */
exports.giveColor = (member, color) => {
	const { colors } = client.constants;
	if (colors.includes(color)) {
		colors.forEach(c => this.removeRole(member, c));
		this.giveRole(member, color);
	}

};

/**
 * Convert a user to a GuildMember instance
 * @param {import('discord.js').User} user - The user the convert
 * @returns {import('discord.js').GuildMember} The 	GuildMember` representation of the `user`
 */
exports.userToMember = user => {
	const { GUILD_ID } = client.env;
	return client.guilds.cache.get(GUILD_ID).members.cache.get(user.id);
};

/**
 *
 * @param {import('discord.js').GuildMember} member
 * @param {String} roleName
 * @param {String} type
 */
async function modifyRole(member, roleName, type = 'add') {
	const { roles, guild } = member,
		{ logger } = client,
		role = guild.roles.cache.find(r => r.name === roleName);

	// TODO: Create the role?
	if (role) {
		if (type === 'add') {roles.add(role.id);}
		else {roles.remove(role.id);}
	}

	else {logger.warn(`${guild.name} does not have a role named: ${roleName}`);}
}

/**
 * Remove the Role to the given Member, if said role exists
 * @param {import('discord.js').GuildMember} member The member to remove the role to
 * @param {String} roleName The name of the role to remove
 */
exports.removeRole = async (member, roleName) => {
	if (this.hasRole(member, roleName)) {
		await modifyRole(member, roleName, 'remove');
		client.logger.event(`Removed ${roleName} from ${member.user.username}`);
	}
};

/**
 * Assigns the Role to the given Member, if said role exists
 * @param {import('discord.js').GuildMember} member The member to give the role to
 * @param {String} roleName The name of the role to give
 */
exports.giveRole = async (member, roleName) => {
	if (!this.hasRole(member, roleName)) {
		await modifyRole(member, roleName, 'add');
		client.logger.event(`Gave ${member.user.username} role: ${roleName}`);
	}
};

/**
 * Checks if the given member contains the role name
 * @param {import('discord.js').GuildMember} member The member check roles
 * @param {String} roleName The name of the role to give
 */
exports.hasRole = (member, roleName) => {
	return member.roles.cache.some(role => role.name.toLowerCase() === roleName.toLowerCase());
};


// https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
/**
 *	Converts seconds into a formatted string (hh:mm:ss)
 * @param {Number} s - The seconds to convert
 * @returns {String} A String representing the seconds in hh:mm:ss format
 */
exports.msToTime = (s) => {

	// Pad to 2 or 3 digits, default is 2
	function pad(n, z) {
		z = z || 2;
		return ('00' + n).slice(-z);
	}

	const ms = s % 1000;
	s = (s - ms) / 1000;
	const secs = s % 60;
	s = (s - secs) / 60;
	const mins = s % 60;
	const hrs = (s - mins) / 60;

	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
};


exports.adminVerification = (member) => {
	return this.hasRole(member, 'administrator');
};

exports.modVerification = (member) => {
	return this.hasRole(member, 'moderator');
};

exports.isConnectedToVoiceChannel = (member) => {
	const { voice: voiceState } = member;
	return voiceState && voiceState.channel;
};

/**
 *
 * @returns {MessageEmbed}
 */
exports.createEmbed = () => {
	return new MessageEmbed().setColor(process.env.EMBED_COLOR);
};
