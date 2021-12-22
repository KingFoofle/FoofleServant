/**
 * Constructs a Leaderboard Embed Message.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('mongoose').module} database - The database to search through
 * @param {Object} filter - The filter applied to the database
 * @param {String} title - The Title of the Leaderboard
 * @param {String} subtitle - The Title of the values column
 * @returns The Leaderboard Embed Message
 */
const buildLeaderBoard = async function(client, database, filter, title, subtitle) {
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

	return client.tools.createEmbed()
		.setTitle(title)
		.addFields([
			{ name: `_Top ${users.length}_`, value: names, inline:true },
			{ name: '\u200B', value: divisor, inline:true },
			{ name:subtitle, value: values, inline:true },
		])
		.addField('\u200B', '\u200B')
		.setFooter('Last Updated: ')
		.setTimestamp();
};

const updateLeaderBoards = async function(client) {
	const { userSchema: userDB } = client.database,
		{ channels, env } = client,


		// Construct the embed
		leaderBoard = await buildLeaderBoard(
			client,
			userDB,
			{ currency:-1 },
			'🏆 __Most Foof Coins__ 🏆',
			'_Foof Coins_',
		),

		// Find the Leaderboards Channel
		channel = await channels.cache.get(env.LEADERBOARD_CHANNEL_ID);

	// Edit the message if it exists, otherwise just send the message
	channel.messages.fetch(env.LEADERBOARD_MESSAGE_ID)
		.then((message) => message.edit({ embeds: [leaderBoard] }))
		.catch(() => channel.send({ embeds: [leaderBoard] }));
};

/**
 * Emitted when the client becomes ready to start working.
 * @param {import('discord.js').Client} client The Discord Client
 */
module.exports = async (client) => {
	const { env, user, logger, tools } = client;
	let status, activity, type;
	if (env.PRODUCTION_MODE) {
		status = 'dnd';
		activity = 'Foofle is performing maintenance on me.';
		type = 'WATCHING';
	}
	else {
		status = 'online';
		activity = 'Feeling great! Type $help for a list of commands';
		type = 'PLAYING';
	}

	// Initializing the tools
	tools.init(client);

	user.setPresence({ activities: [{ name: activity, type:type }], status: status });
	updateLeaderBoards(client);
	logger.ready(`Ready! Logged in as ${user.tag}`);
};

module.exports.once = true;