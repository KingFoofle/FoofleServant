const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, id, ...reason) => {
	const { logger } = client,
		{ guild, member } = message;

	let unbannedUser,
		success,
		failReason;


	reason = reason ? reason.join(' ') : 'No Reason Provided';
	if (!id) {reason = 'No ID Provided!';}

	if (Permissions.FLAGS.BAN_MEMBERS) {
		try {
			unbannedUser = await guild.members.unban(id, reason);
			logger.event(`${member.user.username} unbanned ${unbannedUser.username}`);
			success = true;
		}

		catch (err) {
			failReason = 'An Error occurred.';
			logger.error(err);
		}
	}

	else {
		failReason = 'Insufficient Permissions.';
	}

	const reply = success ?
		`You unbanned ${unbannedUser.username}` :
		`Unbanning Failed.\nReason: ${failReason}`;


	return message.reply(reply);
};