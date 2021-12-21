const { Permissions } = require('discord.js');

/**
 * Kick a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} mention The string formatted version of the mention
 * @param {...String} kickReason The reason for kicking the user
 */
module.exports.execute = async (client, message, mention, ...kickReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let kickedUser;
	let reason;

	kickReason = kickReason ? kickReason.join(' ') : 'No Reason Provided';
	if (!target || !target.id) {reason = 'No User Mentioned!';}

	else if (target.id === member.id) {reason = 'You cannot kick yourself.';}
	else if (target.kickable && !(target.permissions.has(Permissions.FLAGS.KICK_MEMBERS))) {

		try {
			kickedUser = await target.kick(kickReason);
		}

		catch (err) {
			logger.error(err);
			reason = 'Error';
		}
	}

	else {reason = 'Unkickable';}

	const reply = kickedUser ?
		`You kicked ${target.user.username}.\nReason: ${kickReason}` :
		`Kick unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
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