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

	return createEmbed().setTitle(title).addFields([
		{ name: `_Top ${users.length}_`, value: names, inline:true },
		{ name: '\u200B', value: divisor, inline:true },
		{ name:subtitle, value: values, inline:true },
	])
		.addField('\u200B', '\u200B')
		.setFooter('Last Updated: ')
		.setTimestamp();
};

/**
 *
 * @param {Array} videos
 */
exports.buildQueue = function(videos) {
	let names = '', values = '', divisor = '';
	const videoCount = videos.length - 11 < 0 ? 0 : videos.length - 11;

	// Build each column
	let i = 1;
	videos.slice(1, 11).forEach(video => {
		names = names.concat(`${i++}) ${video.title}\n`);
		divisor = divisor.concat('|\n');
		values = values.concat(`${video.duration}\n`);
	});

	// Build the Embed, and include the current song
	const embed = createEmbed()
		.setTitle('Queue')
		.addFields([
			{ name:'Current Song', value:`${videos[0].title}`, inline:true },
			{ name: '\u200B', value: '|', inline:true },
			{ name: 'Duration', value:videos[0].duration, inline:true },
		]);

	// Add the songs in the queue, if present
	if (names) {
		embed.addFields([
			{ name:'\u200B', value: '\u200B' },
			{ name: 'Song Title', value: names, inline:true },
			{ name: '\u200B', value: divisor, inline:true },
			{ name: 'Duration', value: values, inline:true },
		]);
	}

	// Include songs that aren't listed
	if (videoCount) {embed.setFooter(`And ${videoCount} more songs...`);}

	return embed;

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


// https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript/9763479
exports.secondsToTime = function(s) {

	// Pad to 2 or 3 digits, default is 2
	function pad(n, z) {
		z = z || 2;
		return ('00' + n).slice(-z);
	}

	const secs = s % 60;
	s = (s - secs) / 60;
	const mins = s % 60;
	const hrs = (s - mins) / 60;

	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
};

/**
 *
 * @returns {MessageEmbed}
 */
const createEmbed = exports.createEmbed = function() {
	return new MessageEmbed().setColor(process.env.EMBED_COLOR);
};

// Constants
exports.commandTypes = {
	SLASH: 'Slash',
	COMMAND: 'Command',
	BUTTON: 'Button',
	VOICE: 'Voice',
	ADMIN: 'Admin',
	PRODUCT: 'Product',
};

exports.emojiToRoleName = {
	'🎉': 'Events',
	'🧏': 'Podcasts',
	'🏆': 'Tournaments',
};

exports.customEmojiIdToRoleName = {
	// None
};
