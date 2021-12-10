const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, mention, ...banReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let success;
	let reason;

	banReason = banReason ? banReason.join(' ') : 'No Reason Provided';

	if (!target) {reason = 'No User Mentioned!';}

	else if (member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
		if (target.id === member.id) {reason = 'You cannot ban yourself.';}
		else if (target.bannable) {

			try {
				// Ban and delete 7 days worth of replys
				await target.ban({ days: 7, reason: reason });
				success = true;
			}

			catch (err) {
				logger.error(err);
				reason = 'Error';
			}
		}
		else {reason = 'Unbannable';}
	}
	else { reason = 'Insufficient Permissions';}

	const reply = success ?
		`You banned ${target.user.username}.\nReason: ${banReason}` :
		`Ban unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
};