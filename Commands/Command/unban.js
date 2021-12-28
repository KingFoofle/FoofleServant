const { run, canBeUsedBy } = require('./ban');

/**
 * Unban a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} id The ID of the user to unban
 * @param {...String} reason The reason for unbanning the user
 */
exports.execute = async (client, message, id, ...reason) => {
	run(client, message, id, reason.join(' '), 'Unban');
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	return canBeUsedBy(client, member);
};

exports.description = 'Unban a Member from the server.';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$unban [User_ID]';