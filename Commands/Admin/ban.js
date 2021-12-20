const { Permissions } = require('discord.js');

/**
 * Ban a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} mention The string formatted version of the mention
 * @param {...String} banReason The reason for banning the user
 */
exports.execute = async (client, message, mention, ...banReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let bannedUser;
	let reason;

	if (!banReason) banReason = ['No Reason Provided'];
	if (!target || !target.id) {reason = 'No User Mentioned!';}

	else if (target.id === member.id) {reason = 'You cannot ban yourself.';}
	// you cannot ban admins
	else if (target.bannable) {

		try {
			// Ban and delete 7 days worth of replys
			bannedUser = await target.ban({ days: 7, reason: banReason });
		}

		catch (err) {
			logger.error(err);
			reason = 'Error';
		}
	}
	else {reason = 'Unbannable';}

	const reply = bannedUser ?
		`You banned ${target.user.username}.\nReason: ${banReason}` :
		`Ban unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	// Only Members who can ban
	if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
		return 'Insufficient Permissions';
	}
};