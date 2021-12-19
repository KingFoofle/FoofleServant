const { Permissions } = require('discord.js');

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

exports.canBeUsedBy = (client, member) => {
	if (!member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
		return { reason: 'Insufficient Permissions' };
	}
};