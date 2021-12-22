/**
 * Emitted when a song has changed
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 * @param {import('discord-music-player').Song} newSong The Song that has begun playing
 * @param {import('discord-music-player').Song} oldSong The Song that has finished playing
*/
module.exports = async (client, queue, newSong, oldSong) => {
	const { tools, formatter } = client;
	const { message } = queue.data,
		embed = tools.createEmbed()
			.setTitle('Now Playing')
			.setThumbnail(newSong.thumbnail)
			.addFields([
				{ name: 'Name', value: formatter.italic(newSong.name) },
				{ name: 'Duration', value: newSong.duration },
			]);

	message.channel.send({ embeds: [embed] });
};