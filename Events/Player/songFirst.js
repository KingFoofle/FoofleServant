/**
 * Emitted when the first song in the queue begins to play
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 * @param {import('discord-music-player').Song} song The Song that was added
*/
module.exports = async (client, queue, song) => {
	const { tools, formatter } = client;
	const { message } = queue.data,
		embed = tools.createEmbed()
			.setTitle('Now Playing')
			.setThumbnail(song.thumbnail)
			.addFields([
				{ name: 'Name', value: formatter.italic(song.name) },
				{ name: 'Duration', value: song.duration },
			]);

	message.channel.send({ embeds: [embed] });
};