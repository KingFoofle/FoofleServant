const { Permissions } = require('discord.js');

module.exports.execute = async (client, message, id, ...reason) => {
	const { logger } = client,
		{ guild, member } = message;

	let unbannedUser,
		failReason;


	reason = reason ? reason.join(' ') : 'No Reason Provided';
	if (!id) {reason = 'No ID Provided!';}

	try {
		unbannedUser = await guild.members.unban(id, reason);
		logger.event(`${member.user.username} unbanned ${unbannedUser.username}`);
	}

	catch (err) {
		failReason = 'An Error occurred.';
		logger.error(err);
	}

	const reply = unbannedUser ?
		`You unbanned ${unbannedUser.username}` :
		`Unbanning Failed.\nReason: ${failReason}`;


	return message.reply(reply);
};

exports.canBeUsedBy = (client, member) => {
	if (!member.permissions.has(Permissions.BAN_MEMBERS)) {
		return { reason: 'Insufficient Permissions' };
	}
};