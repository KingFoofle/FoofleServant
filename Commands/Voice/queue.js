/**
 * Display the Music Queue of the Bot
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 */
exports.execute = async (client, message) => {
	const { formatter } = client;

	/** @type {import('discord-music-player').Queue} */
	const queue = client.player.getQueue(message.guildId);
	const firstSong = queue.songs.at(0);

	if (!firstSong) return message.reply('No songs in the Queue');

	// Build the embed values
	let content = '', duration = '', i = 1;
	queue.songs.slice(1, 11).forEach(song => {
		content += `${i++}) ` + formatter.italic(song.name) + '\n';
		duration += song.duration + '\n';
	});

	const queueEmbed = client.tools.createEmbed()
		.setTitle('Queue')
		.addField('Currently Playing', formatter.italic(firstSong.name), true)
		.addField('Duration', queue.createProgressBar().times, true)
		.addField('\u200B', '\u200B');

	if (content) {
		queueEmbed.addFields([
			{ name: 'Songs', value: content, inline: true },
			{ name: 'Duration', value: duration, inline: true },
		]);
	}

	return message.reply({ embeds: [queueEmbed] });

};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
// eslint-disable-next-line no-unused-vars
exports.canBeUsedBy = (client, member) => {
	// Anyone can use this command
};