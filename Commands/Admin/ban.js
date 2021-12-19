const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, mention, ...banReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let bannedUser;
	let reason;

	banReason = banReason ? banReason.join(' ') : 'No Reason Provided.';
	if (!target) {reason = 'No User Mentioned!';}

	else if (member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
		if (target.id === member.id) {reason = 'You cannot ban yourself.';}
		// you cannot ban admins
		else if (target.bannable && !(target.permissions.has(Permissions.FLAGS.BAN_MEMBERS))) {

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
	}
	else { reason = 'Insufficient Permissions';}

	const reply = bannedUser ?
		`You banned ${target.user.username}.\nReason: ${banReason}` :
		`Ban unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
};