const { Player } = require('discord-music-player');
const Formatter = require('@discordjs/builders');

/**
 * Creates a Player with some event callbacks assigned
 * @param {import('discord.js').Client} client
 * @returns {Player}
 */
module.exports.getPlayer = function(client) {
	const { logger, tools } = client;

	/**
   * @returns {import('discord.js').MessageEmbed}
   */
	function createEmbed() {
		return tools.createEmbed();
	}

	function nowPlaying(queue, song) {
		const { message } = queue.data,
			embed = createEmbed()
				.setTitle('Now Playing')
				.setThumbnail(song.thumbnail)
				.addFields([
					{ name: 'Name', value: Formatter.italic(song.name) },
					{ name: 'Duration', value: song.duration },
				]);

		message.channel.send({ embeds: [embed] });
	}

	const player = new Player(client)
	// Emitted when channel was empty.
		.on('channelEmpty', (queue) => {
			const { message } = queue.data,
				embed = createEmbed()
					.setTitle('Disconnected')
					.addField('Reason', 'Everyone left the Voice Channel');

			message.channel.send({ embeds:[embed] });
		})

	// Emitted when a song was added to the queue.
		.on('songAdd', (queue, song) => {
			// queue.data.message is set in play.js
			const { message } = queue.data,
				position = queue.songs.indexOf(song),
				embed = createEmbed()
					.setThumbnail(song.thumbnail)
					.setTitle('Song Added')
					.addFields([
						{ name: 'Name', value: Formatter.italic(song.name) },
						// { name: 'Requested By', value: song.requestedBy },
						{ name: 'Length', value: song.duration },
						{ name: 'Position in Queue', value: position.toString() },
					]);

			// Send the reply to the user
			message.reply({ embeds: [embed] });
		})


	// Emitted when a playlist was added to the queue.
		.on('playlistAdd', (queue, playlist) => {
			// queue.data.message is set in playlist.js
			const { message } = queue.data,
				embed = createEmbed()
					.setTitle('Playlist Added')
					.addFields([
						{ name: 'Name', value: Formatter.italic(playlist.name) },
						{ name:'Length', value: playlist.songs.length },
					]);

			message.reply({ embeds: [embed] });
		})

	// Emitted when a first song in the queue started playing.
		.on('songFirst', (queue, song) => {
			nowPlaying(queue, song);
		})

	// Emitted when a song changed.
		.on('songChanged', (queue, newSong, oldSong) => {
			nowPlaying(queue, newSong);
		})

	// Emitted when someone disconnected the bot from the channel.
		.on('clientDisconnect', (queue) =>
			console.log('I was kicked from the Voice Channel, queue ended.'))

	// Emitted when deafenOnJoin is true and the bot was undeafened
		.on('clientUndeafen', (queue) =>
			console.log('I got undefeanded.'))

	// Emitted when there was no more music to play.
		.on('queueDestroyed', (queue) =>
			console.log('The queue was destroyed.'))

	// Emitted when the queue was destroyed (either by ending or stopping).
		.on('queueEnd', (queue) =>
			console.log('The queue has ended.'))

	// Emitted when there was an error in runtime
		.on('error', (error, queue) => {
			logger.error(`Error: ${error} in ${queue.guild.name}`);
		});

	return player;

};