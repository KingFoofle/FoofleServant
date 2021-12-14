const Voice = require('@discordjs/voice'),
	ytdl = require('ytdl-core'),
	yts = require('yt-search');


/**
 * Attempts to get a Link from Youtube given the Search Query or Link
 * @param {String} ytSearch - The link or youtube query to search
 * @returns The first valid URL found
 */
async function getVideo(ytSearch) {
	let title, url, duration;
	if (ytdl.validateURL(ytSearch)) {
		// It is a link
		const songInfo = await ytdl.getInfo(ytSearch);
		const { videoDetails: basicInfo } = songInfo.player_response;
		const { videoDetails } = songInfo;

		title = basicInfo.title,
		url = videoDetails.video_url;
		duration = basicInfo.lengthSeconds;

	}
	else {
		// It is a search query
		const { videos } = await yts(ytSearch);
		if (!videos.length) return { error: 'No videos found!' };
		const v = videos[0];

		title = v.title;
		url = v.url;
		duration = v.seconds;
	}

	return {
		title: title,
		url: url,
		duration: duration,
	};
}


async function onDisconnected(connection) {
	const { VoiceConnectionStatus, entersState } = Voice;
	try {
		// Give it 5 seconds to reconnect
		const msToWait = 5_000;
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Signalling, msToWait),
			entersState(connection, VoiceConnectionStatus.Connecting, msToWait),
		]);
		// Seems to be reconnecting to a new channel - ignore disconnect
	}
	catch (error) {
		// Seems to be a real disconnect which SHOULDN'T be recovered from
		connection.destroy();
	}
}

/**
 * Assign events to be handled to the given connection
 * @param {MusicManager} manager
 * @param {VoiceConnection} connection
 */
function assignConnectionEvents(manager, connection) {
	const { VoiceConnectionStatus } = Voice;

	// eslint-disable-next-line no-unused-vars
	const { Ready, Connecting, Destroyed, Disconnected, Signalling } = VoiceConnectionStatus;
	connection.on(Ready, () => {
		manager.client.logger.ready('VoiceConnection Connected Successfully');
	});

	connection.on(Destroyed, () => {
		manager.client.logger.success('VoiceConnection Destroyed Successfully');
	});

	connection.on(Disconnected, async () => {
		onDisconnected(connection);
	});

}

/**
 * Assign Audio events to the player
 * @param {MusicManager} manager
 * @param {AudioPlayer} player
 */
function assignAudioEvents(manager, player) {
	const { client, videoQueue: videos } = manager;
	player
		.on('error', (error) => {
			client.logger.error(`Error:  ${error.message}`);
			manager.disconnect();
		})

		.on(Voice.AudioPlayerStatus.Idle, async () => {
			const video = videos.shift();
			player.play(video.resource);
		});


}

/*
TODO:
* STOP doesn't work
* Queuing doesn't work
* AudioPlayerStatud.Idle needs work
*/


class MusicManager {

	constructor(client, guildId) {
		this.client = client;
		this.guildId = guildId;
		this.audioPlayer = Voice.createAudioPlayer();
		this.videoQueue = [];
		assignAudioEvents(this, this.audioPlayer);
	}

	getVoiceConnection() {
		return Voice.getVoiceConnection(this.guildId);
	}

	destroyVoiceConnection() {
		this.audioPlayer.stop();
		return this.getVoiceConnection().destroy();
	}

	/**
     * Alibi for `destroyVoiceConnection`
     */
	disconnect() {
		this.destroyVoiceConnection();
	}

	/**
     *
     * @param {Object} joinOptions - The options to join the Voice Channel
     * @returns
     */
	joinVoiceChannel({ channelId, selfDeaf = false, selfMute = false }) {
		if (this.getVoiceConnection()) {
			return this.client.logger.warn('Bot is already connected to a Voice Channel!');
		}

		const guild = this.client.guilds.cache.get(this.guildId);

		const options = {
			channelId: channelId,
			guildId: this.guildId,
			adapterCreator: guild.voiceAdapterCreator,
			selfDeaf: selfDeaf,
			selfMute: selfMute,
		};

		const connection = Voice.joinVoiceChannel(options);

		// Empty the Queue
		this.videoQueue = [];

		// Set events for the connection
		assignConnectionEvents(this, connection);
		return connection;
	}

	async add(searchQuery) {
		const connection = this.getVoiceConnection();
		if (!connection) {return { error: 'Bot is not connected to any voice channels' };}

		const video = await getVideo(searchQuery);
		if (!video) {return { error: `No videos found for arg: ${searchQuery}` };}

		const stream = ytdl(video.url, { filter: 'audioonly' });
		const resource = Voice.createAudioResource(stream, { inputType: Voice.StreamType.Arbitrary });

		video.resource = resource;

		// Push the resource to the queue
		this.videoQueue.push(video);
		return video;

	}

	async play(searchQuery) {

		// Add the resource
		const video = await this.add(searchQuery);
		if (video.error) {return { error: video.error };}

		// We just added our first resource!
		if (this.videoQueue.length === 1) {
			// Find the connection
			const connection = this.getVoiceConnection();

			// Start playing from the first resource that we have
			this.audioPlayer.play(this.videoQueue.shift().resource);
			connection.subscribe(this.audioPlayer);
		}

		return { video: video, position: this.videoQueue.length };

		// If the audio player WAS found, then all we did was add to the queue
	}

	/**
	 * Empties the queue and destroys the AudioPlayer
	 * @returns `true` if the player will come to a stop, otherwise `false`
	 */
	stop() {
		// Empty the queue
		this.videoQueue = [];
		if (this.audioPlayer) {
			return this.audioPlayer.stop();
		}
	}

	/**
	 * Skips the current song.
	 * @returns The video that is now playing
	 */
	skip() {
		if (this.audioPlayer) {
			const vid = this.videoQueue.shift();
			if (vid) this.audioPlayer.play(vid.resource);
			return vid;
		}
	}

	/**
	 * Pauses playback of the current resource, if any.
	 * @returns `true` if the player was successfully paused, otherwise `false`
	 */
	pause() {
		if (this.audioPlayer) { return this.audioPlayer.pause(true);}
	}

	/**
	 * Unpauses playback of the current resource, if any.
	 * @returns `true` if the player was successfully unpaused, otherwise `false`
	 */
	resume() {
		if (this.audioPlayer) {return this.audioPlayer.unpause();}
	}
}

module.exports = { MusicManager };

