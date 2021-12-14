const { MessageEmbed } = require('discord.js');


/**
 * Constructs a Leaderboard Embed Message.
 * @param {Object} args
 * @param {*} args.database - The database to search through
 * @param {Object} args.filter - The filter applied to the database
 * @param {String} args.title - The Title of the Leaderboard
 * @param {String} args.subtitle - The Title of the values column
 * @returns The Leaderboard Embed Message
 */
exports.buildLeaderBoard = async function({ database, filter, title, subtitle }) {
	// The columns of the leaderboard
	let names = '', values = '', divisor = '';
	const medals = ['🥇', '🥈', '🥉' ];
	const users = await database.find({}).sort(filter).limit(10);
	let i = 1;

	// Build each column
	for (const user of users) {
		const medal = i - 1 < medals.length ? medals[i - 1] : '';
		names = names.concat(`#${i++} ${user.username}${medal}\n`);
		divisor = divisor.concat('|\n');
		values = values.concat(`${user.currency}\n`);
	}

	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(title)
		.addFields(
			{ name: `_Top ${users.length}_`, value: names, inline:true },
			{ name: '\u200B', value: divisor, inline:true },
			{ name:subtitle, value: values, inline:true })
		.addField('\u200B', '\u200B')
		.setFooter('Last Updated: ')
		.setTimestamp();
};

/**
 * Given a User ID, return their respective GuildMember instance
 */
exports.getMemberFromUserId = async function(client, userId) {
	const { GUILD_ID } = client.env;
	return client.guilds.cache.get(GUILD_ID).members.cache.get(userId);
};

/**
 * Assigns the roleName parameter to member, if said role exists
 * @param {Object} args
 * @param {*} args.member
 * @param {String} args.roleName
 */
exports.giveRole = ({ member, roleName }) => {
	const { roles, guild, client, user } = member;
	const role = guild.roles.cache.find(r => r.name === roleName);
	if (role) {
		roles.add(role.id);
		client.logger.event(`Gave ${user.username} role: ${role.name}`);
	}

	else {
		client.logger.warn(`${guild.name} does not have a role named: ${roleName}`);
	}
};

// TODO: Update this. client.config doesn't exist, and I'm sure message.client is a thing
exports.logToAdminChannel = (client, message) => {
	// Maybe use a constant time zone?
	message = `*${new Date().toLocaleString()}:*\n${message}`;
	client.channels.cache.get(client.config.logChannelId).send(message);
};

// Constants
exports.commandTypes = {
	SLASH: 'Slash',
	COMMAND: 'Command',
	BUTTON: 'Button',
};

exports.emojiToRoleName = {
	'🎉': 'Events',
	'🧏': 'Podcasts',
	'🏆': 'Tournaments',
};

exports.customEmojiIdToRoleName = {
	// None
};
