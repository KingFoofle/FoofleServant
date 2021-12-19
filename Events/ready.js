async function updateLeaderBoards(client) {
	const { userSchema: userDB } = client.database;
	const { channels, env } = client;


	// Construct the embed
	const leaderBoard = await client.tools.buildLeaderBoard({
		filter: { currency:-1 },
		database: userDB,
		title : '🏆 __Most Foof Coins__ 🏆',
		subtitle : '_Foof Coins_' },
	);

	// Find the Leaderboards Channel
	const channel = await channels.cache.get(env.LEADERBOARD_CHANNEL_ID);

	// Edit the message if it exists, otherwise just send the message
	channel.messages.fetch(env.LEADERBOARD_MESSAGE_ID)
		.then((message) => message.edit({ embeds: [leaderBoard] }))
		// eslint-disable-next-line no-unused-vars
		.catch((err) => channel.send({ embeds: [leaderBoard] }));
}

module.exports = async (client) => {
	let status, activity, type;
	if (client.env.PRODUCTION_MODE) {
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
	client.music.init(client);

	client.user.setPresence({ activities: [{ name: activity, type:type }], status: status });
	updateLeaderBoards(client);
	client.logger.ready(`Ready! Logged in as ${client.user.tag}`);
};

module.exports.once = true;