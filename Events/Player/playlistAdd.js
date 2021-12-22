/**
 * Emitted when a playlist was added to the queue.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 * @param {import('discord-music-player').Playlist} playlist The Playlist that was added
 */
module.exports = async (client, queue, playlist) => {
	const { tools, formatter } = client;
	// queue.data.message is set in playlist.js
	// https://stackoverflow.com/questions/52997764/calculate-sum-with-foreach-function
	const totalMs = playlist.songs.reduce((total, song) => total + song.milliseconds, 0);
	const { message } = queue.data,
		embed = tools.createEmbed()
			.setTitle('Playlist Added')
			.addFields([
				{ name: 'Name', value: formatter.italic(playlist.name) },
				{ name: 'Duration', value: tools.msToTime(totalMs), inline:true },
				{ name: 'Total Songs', value: playlist.songs.length.toString(), inline:true },
			]);

	message.reply({ embeds: [embed] });
};