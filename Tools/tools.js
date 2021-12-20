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
exports.init = function(c) {
	client = c;
};

/**
 * Convert a user to a GuildMember instance
 * @param {import('discord.js').User} user - The user the convert
 * @returns {import('discord.js').GuildMember} The 	GuildMember` representation of the `user`
 */
exports.userToMember = function(user) {
	const { GUILD_ID } = client.env;
	return client.guilds.cache.get(GUILD_ID).members.cache.get(user.id);
};

/**
 * Assigns the Role to the given Member or User, if said role exists
 * @param {import('discord.js').GuildMember | import('discord.js').User } member The user to give the role to
 * @param {String} roleName The name of the role to give
 */
exports.giveRole = (member, roleName) => {
	const { roles, guild, user } = member,
		{ logger } = client,
		role = guild.roles.cache.find(r => r.name === roleName);

	if (role) {
		roles.add(role.id);
		logger.event(`Gave ${user.username} role: ${role.name}`);
	}

	else {logger.warn(`${guild.name} does not have a role named: ${roleName}`);}
};


// https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
/**
 *	Converts seconds into a formatted string (hh:mm:ss)
 * @param {Number} s - The seconds to convert
 * @returns {String} A String representing the seconds in hh:mm:ss format
 */
exports.secondsToTime = function(s) {

	// Pad to 2 or 3 digits, default is 2
	const pad = function(n, z) {
		z = z || 2;
		return ('00' + n).slice(-z);
	};

	const secs = s % 60;
	s = (s - secs) / 60;
	const mins = s % 60;
	const hrs = (s - mins) / 60;

	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
};

exports.hasRoleName = (member, roleName) => {
	return member.roles.cache.some(role => role.name.toLowerCase() === roleName.toLowerCase());
};

exports.adminVerification = function(member) {
	return this.hasRoleName(member, 'administrator');
};

exports.modVerification = function(member) {
	return this.hasRoleName(member, 'moderator');
};

exports.isConnectedToVoiceChannel = function(member) {
	const { voice: voiceState } = member;
	return voiceState && voiceState.channel;
};

/**
 *
 * @returns {MessageEmbed}
 */
exports.createEmbed = function() {
	return new MessageEmbed().setColor(process.env.EMBED_COLOR);
};
