/**
 * Emitted when a song was added to the queue.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 * @param {import('discord-music-player').Song} song The Song that was added
*/
module.exports = async (client, queue, song) => {
	const { tools, formatter } = client;
	// queue.data.message is set in play.js
	const { message } = queue.data,
		position = queue.songs.indexOf(song),
		embed = tools.createEmbed()
			.setThumbnail(song.thumbnail)
			.setTitle('Song Added')
			.addFields([
				{ name: 'Name', value: formatter.italic(song.name) },
				// { name: 'Requested By', value: song.requestedBy },
				{ name: 'Length', value: song.duration },
				{ name: 'Position in Queue', value: position.toString() },
			]);

	// Send the reply to the user
	message.reply({ embeds: [embed] });
};