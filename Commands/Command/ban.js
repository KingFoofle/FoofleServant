const { Permissions } = require('discord.js');

/**
 *	Ban, kick, or unban a user
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered this command
 * @param {String} mentionOrId The ID or Mention used in the command
 * @param {String} reason The reason for banning/kicking/unbanning this user
 * @param {String} type What command are we using on the target
 * @returns
 */
exports.run = async (client, message, mentionOrId, reason, type = 'ban') => {
	const ban = type.toLowerCase() === 'ban',
		kick = type.toLowerCase() === 'kick',

		target = message.mentions.members.first(),
		{ member, guild } = message,
		{ logger, tools } = client;

	let user, failReason;

	if (!reason || !reason.trim()) reason = 'No Reason Provided';

	if (!mentionOrId || !reason.trim()) {failReason = 'No User Mentioned!';}
	else if (target.id === member.id) {failReason = 'You cannot ' + type + ' yourself.';}

	else {
		try {
			if (ban) {
				// Attempt to Ban
				// Delete up to 7 days worth of messages
				if (target.bannable) {user = await target.ban({ days:7, reason });}
				else { failReason = 'Unbannable';}
			}

			else if (kick) {
				// Attempt to Kick
				if (target.kickable) {user = await target.kick(reason);}
				else {failReason = 'Unkickable';}
			}

			// Attempt to Unban
			else {user = await guild.members.unban(mentionOrId, reason);}
		}

		catch (err) {
			logger.error(err);
			failReason = 'Error';
		}
	}
	const replyEmbed = tools.createEmbed()
		.setTitle(user ? `${user.username} was ` + (ban ? 'banned' : (kick ? 'kicked' : 'unbanned')) : `${type} unsuccessful`)
		.addField('Reason', user ? reason : failReason);

	message.reply({ embeds: [replyEmbed] });
};

/**
 * Ban a user from the Server
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} mention The string formatted version of the mention
 * @param {...String} banReason The reason for banning the user
 */
exports.execute = async (client, message, mention, ...banReason) => {
	this.run(client, message, mention, banReason.join(' '), 'Ban');
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