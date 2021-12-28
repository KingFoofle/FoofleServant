const { Permissions } = require('discord.js'),
	{ run } = require('./ban');

/**
 * Kick a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} mention The string formatted version of the mention
 * @param {...String} kickReason The reason for kicking the user
 */
module.exports.execute = async (client, message, mention, ...kickReason) => {
	run(client, message, mention, kickReason.join(' '), 'Kick');
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	if (!member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
		return 'Insufficient Permissions' ;
	}
};

exports.description = 'Kick a Member from the server.';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$kick [@User]';