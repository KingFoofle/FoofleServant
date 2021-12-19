const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, mention, ...kickReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let kickedUser;
	let reason;

	kickReason = kickReason ? kickReason.join(' ') : 'No Reason Provided';
	if (!target) {reason = 'No User Mentioned!';}

	else if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
		if (target.id === member.id) {reason = 'You cannot kick yourself.';}
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
	}
	else { reason = 'Insufficient Permissions';}

	const reply = kickedUser ?
		`You kicked ${target.user.username}.\nReason: ${kickReason}` :
		`Kick unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
};