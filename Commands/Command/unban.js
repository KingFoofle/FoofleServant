const { Permissions } = require('discord.js');

/**
 * Unban a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} id The ID of the user to unban
 * @param {...String} reason The reason for unbanning the user
 */
module.exports.execute = async (client, message, id, ...reason) => {
	const { logger } = client,
		{ guild, member } = message;

	let unbannedUser,
		failReason;

	if (!reason) reason = ['No Reason Provided'];
	if (!id) {failReason = 'No ID Provided!';}

	else {
		try {
			unbannedUser = await guild.members.unban(id, reason.join(' '));
			logger.event(`${member.user.username} unbanned ${unbannedUser.username}`);
		}

		catch (err) {
			failReason = 'An Error occurred.';
			logger.error(err);
		}
	}

	const reply = unbannedUser ?
		`You unbanned ${unbannedUser.username}\nReason: ${reason.join(' ')}` :
		`Unbanning Failed.\nReason: ${failReason}`;


	return message.reply(reply);
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
		return 'Insufficient Permissions' ;
	}
};