const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, mention, ...kickReason) => {
	const target = message.mentions.members.first(),
		{ member } = message,
		{ logger } = client;

	let success;
	let reason;

	kickReason = kickReason ? kickReason.join(' ') : 'No Reason Provided';

	if (!target) {reason = 'No User Mentioned!';}

	else if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
		if (target.id === member.id) {reason = 'You cannot kick yourself.';}
		else if (target.kickable) {

			try {
				// Ban and delete 7 days worth of replys
				await target.kick(kickReason);
				success = true;
			}

			catch (err) {
				logger.error(err);
				reason = 'Error';
			}
		}
		else {reason = 'Unkickable';}
	}
	else { reason = 'Insufficient Permissions';}

	const reply = success ?
		`You kicked ${target.user.username}.\nReason: ${kickReason}` :
		`Kick unsuccessful.\nReason: ${reason}`;

	return message.reply(reply);
};