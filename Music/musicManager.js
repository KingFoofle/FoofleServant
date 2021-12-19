const {
		// eslint-disable-next-line no-unused-vars
		VoiceConnection, AudioPlayer,
		VoiceConnectionStatus,
		StreamType,
		AudioPlayerStatus,
		entersState,
		joinVoiceChannel,
		createAudioPlayer,
		createAudioResource,
	} = require('@discordjs/voice'),
	ytdl = require('ytdl-core'),
	yts = require('yt-search');

// All the information that all functions should require
let information = resetInfo();

// ******************************************** VIDEO CLASS ******************************************** //
class Video {

	constructor({ title, url, duration:secondsDuration, thumbnailUrl:thumbnail, resource }) {

		// Title of the video
		this.title = title;

		// The Youtube URL
		this.url = url;

		// The duration, in seconds, of the video
		this.durationSeconds = secondsDuration;

		// The duration, in hh:mm:ss format, of the video
		this.duration = information.client.tools.secondsToTime(secondsDuration);

		// The thumbnail URL of the video
		this.thumbnailUrl = thumbnail;

		// The resource that the AudioPlayer should receive
		this.resource = resource;
	}
}

// ******************************************** VOICE CONNECTION EVENTS ******************************************** //

function onReady() {
	const { textChannel, voiceChannel, client } = information;

	const embed = client.tools.createEmbed()
		.setTitle('Connection Successful')
		.addField('Channel Name', `${voiceChannel.name}`, true)
		// We subtract 1 because the bot doesn't count as a member in our logic
		.addField('Member Count', `${voiceChannel.members.size - 1}`, true);

	textChannel.send({ embeds: [embed] });
}

async function onDisconnected() {
	const { connection } = information.subscription;
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
		disconnect('the channel possibly being deleted');
	}
}

// eslint-disable-next-line no-empty-function
function onDestroyed() {}
// eslint-disable-next-line no-empty-function
function onSignalling() {}
// eslint-disable-next-line no-empty-function
function onConnecting() {}

// ******************************************** AUDIO PLAYER EVENTS ******************************************** //


// eslint-disable-next-line no-empty-function
function onBuffering() {}
// eslint-disable-next-line no-empty-function
function onPaused() {}
// eslint-disable-next-line no-empty-function
function onAutoPaused() {}

function onPlaying() {
	const { currentVideo, textChannel, client } = information;

	const embed = client.tools.createEmbed()
		.setThumbnail(currentVideo.thumbnailUrl)
		.addField('Now Playing', `*${currentVideo.title}*`)
		.addField('Duration', `${currentVideo.duration}`);

	textChannel.send({ embeds: [embed] });
}

function onIdle() {
	const { videos } = information;
	// Remove the video at the top of the Queue
	videos.shift();

	// Play the next song
	playNextVideo(videos.at(0));
}

// ******************************************** FUNCTIONS ******************************************** //

/**
 *
 * @param {VoiceConnection | AudioPlayer} object The object to assign events to
 * @param {VoiceConnectionStatus | AudioPlayerStatus} enumV The possible status for the object
 * @param {Object} events An object connecting Status to Event Callback
 * @returns {VoiceConnection | AudioPlayer} The object with all of its events assigned
 */
function assignEvents(object, enumV, events) {
	for (const state of Object.values(enumV)) {
		const event = events[state];
		if (event) {object.on(state, event);}
	}
	return object;
}

/**
 * Initialize a `VoiceConnection`, with all events assigned
 * @param {JoinVoiceChannelOptions} options
 * @returns {VoiceConnection} A `VoiceConnection` with all events assigned
 */
function createVoiceConnection(options) {
	const voiceConnection = joinVoiceChannel(options),

		voiceConnectionEvents = {
			ready : onReady,
			destroyed: onDestroyed,
			disconnected: onDisconnected,
			signalling: onSignalling,
			connecting: onConnecting,
		};

	// Assign all the events to the voice connection
	return assignEvents(voiceConnection, VoiceConnectionStatus, voiceConnectionEvents);
}

/**
 * Initialize an `AudioPlayer`, with all events assigned
 * @param {CreateAudioPlayerOptions} options
 * @returns {AudioPlayer} An `AudioPlayer` with all events assigned
 */
function createAudioPlayerWithEvents() {
	const audioPlayerEvents = {
			idle: onIdle,
			buffering: onBuffering,
			paused: onPaused,
			playing: onPlaying,
			autopaused: onAutoPaused,
		}, audioPlayer = createAudioPlayer();

	// Assign all the events to the Audio Player
	audioPlayer.on('error', (err) => information.client.logger.error(err));
	return assignEvents(audioPlayer, AudioPlayerStatus, audioPlayerEvents);
}

/**
 * Attempts to get a Link from Youtube given the Search Query or URL
 * @param {Object} options - The link or youtube query to search
 * @param {String} options.query - The query to search on Youtube
 * @param {String} options.url - The url to search on Youtube
 * @param {Function} options.filter - The filter to apply if a query is given.
 * It should take one parameter, which the current element being processed in the array
 * @returns {Promise<Video>} A video that matches the given criteria
 */
async function getVideo({ query, url, filter }) {
	// TODO: Filter Mature Videos
	let video;
	// Prioritize URLs
	if (url) {
		// Link is invalid
		if (!validateURL(url)) return;

		// Utilize ytdl and extract all of the video information
		const songInfo = await ytdl.getInfo(url);
		const { videoDetails: basicInfo } = songInfo.player_response;
		const { videoDetails } = songInfo;

		video = new Video({
			title: basicInfo.title,
			url: videoDetails.video_url,
			duration: parseInt(basicInfo.lengthSeconds),
			thumbnailUrl: basicInfo.thumbnail.thumbnails.at(0).url,
		});

	}

	else if (query) {
		let { videos } = await yts(query);
		// Apply the filter if present
		if (filter) videos = videos.filter(filter);

		// No videos found
		if (!videos.length) return;

		// Grab the first search result
		const v = videos[0];
		video = new Video({
			title: v.title,
			url: v.url,
			duration: v.seconds,
			thumbnailUrl: v.thumbnail,
		});
	}

	// We need to attach the resource to the video
	const stream = ytdl(video.url, {
		quality:'highestaudio',
		filter: 'audioonly',
		highWaterMark: 1 << 25,
	});
	const resource = createAudioResource(stream, {
		inputType: StreamType.Arbitrary,
		metadata: { title: video.title },
	});

	video.resource = resource;
	return video;

}

/**
 * Instruct the AudioPlayer to play the given song. If no song is given, the AudioPlayer will then disconnect
 * from the VoiceChannel after 30 seconds of inactivity.
 * @param {Video} video The video to play
 */
function playNextVideo(video) {
	information.currentVideo = video;
	// There is only no video when the queue is empty!
	if (!video) {
		// Give them 30 seconds to play the next video
		information.leaveTimer = setTimeout(function() {
			disconnect('inactivity');
		}, 30 * 1000);
		return;
	}
	// The user was able to play a video, so we can stop the timer
	clearTimeout(information.leaveTimer);
	information.subscription.player.play(video.resource);
	return;
}

/**
 * Resets the global `information` variable
 */
function resetInfo() {
	return {
		// The client has access to everything that commands have
		// such as .env variables
		client: undefined,

		// Foofle's domain
		guild: undefined,

		// The video that is currently playing
		currentVideo: undefined,

		// The Video Queue
		videos: [],

		// The Text Channel to send messages to
		textChannel: undefined,

		// The Voice Channel
		voiceChannel: undefined,

		// The VoiceConnection -> AudioPlayer subscription
		subscription: undefined,

		// The timer before the connection is destroyed
		leaveTimer: 0,
	};
}

/**
 * Return the total time of the Video lengths
 * @param {Video[]} videos
 * @returns {String} The time total in `hh:mm:ss` format
 */
function getTime(videos) {
	const { client } = information;
	let totalSeconds = 0;

	// Calculate the combined amount of seconds of each video
	videos.forEach(video => totalSeconds += video.durationSeconds);

	return client.tools.secondsToTime(totalSeconds);

}

// ******************************************** EXPORTS ******************************************** //

/**
 * Verifies if the Bot is connected or not
 * @returns {PlayerSubscription} A `PlayerSubscription` if the Bot is connected. Otherwise `undefined`
 */
const isConnected = exports.isConnected = function() {
	return information.subscription;
};

/**
 * Initialize the MusicManager
 * @param {Discord.Client} client
 */
exports.init = function(client) {
	information.client = client;
	information.guild = client.guilds.cache.get(client.env.GUILD_ID);
};

/**
 * Connect the Bot to a specified Voice Channel
 * @param {Object} options
 * @param {Discord.TextChannel} options.textChannel - The Text Channel to reply to on connection success
 * @param {Discord.VoiceChannel} options.voiceChannel - The Voice Channel to connect to
 * @param {Boolean | false} options.selfMute - If `true` mute the bot on join
 */
const connect = exports.connect = function({ textChannel, voiceChannel, selfMute = false, selfDeaf = false }) {
	// Create a new AudioPlayer
	const audioPlayer = createAudioPlayerWithEvents();

	// Create a new VoiceConnection
	const connection = createVoiceConnection({
		guildId: voiceChannel.guild.id,
		channelId: voiceChannel.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		selfMute: selfMute,
		selfDeaf:selfDeaf,
	});

	// Assign the text and voice channel
	information.textChannel = textChannel;
	information.voiceChannel = voiceChannel;

	// Connect the VoiceConnection to the AudioPlayer
	information.subscription = connection.subscribe(audioPlayer);
};

/**
 * Instruct the AudioPlayer to play the given resource. If the AudioPlayer
 * currently playing another resource, add the resource to a queue
 * @param {Object} searchOptions
 * @param {String} searchOptions.query
 * @param {String} searchOptions.url
 * @param {Object} connectOptions - The options to use if the bot is not connected to a voice channel
 */
exports.play = async function({ query, url }, connectOptions) {
	// Connect the bot if a connection is not found
	if (!isConnected()) {connect(connectOptions);}

	const { videos, textChannel, client } = information;

	// Find a video
	const video = await getVideo({ query: query, url:url });

	// Create the embed to send as a reply
	const embed = client.tools.createEmbed();
	if (!video) {embed.addField('Error', `No video found for: ${query || url}`);}
	else {
		// Push the video the the queue
		const len = videos.push(video);
		embed.setThumbnail(video.thumbnailUrl)
			.addField('Added', `*${video.title}*`);


		// Only play the video if it's the first video to be added
		if (len === 1) {playNextVideo(video);}

		// Tell the user their position in the queue
		// along with their wait time
		else {
			embed.addField('Position', `${len - 1}`)
				.setFooter(`Expected Wait Time: ${getTime(videos.slice(0, len - 1))}`);
		}
	}

	textChannel.send({ embeds: [embed] });
};

/**
 * Instructs the AudioPlayer to pause its resource
 */
exports.pause = function() {
	if (isConnected()) information.subscription.player.pause();
};

/**
 * Instructs the AudioPlayer to resume its resource
 */
exports.resume = function() {
	if (isConnected()) information.subscription.player.unpause();
};

/**
 * Disconnects the bot from the Voice channel.
 */
const disconnect = exports.disconnect = function(reason) {
	if (isConnected()) {
		const { player, connection } = information.subscription;
		const { client, guild, voiceChannel, textChannel } = information;
		const message = `Disconnected From ${voiceChannel.name}`;
		player.stop();
		connection.destroy();
		textChannel.send(message.concat(reason ? ` due to ${reason}` : ''));

		// Reset information to only contain client, and guild
		information = resetInfo();
		information.client = client;
		information.guild = guild;
	}
};

/**
 * Empties the queue and stops playing
 */
exports.stop = function() {
	information.videos = [];
	skip();
};

/**
 * Skips the current song, and sets the AudioPlayer to the Idle State.
 */
const skip = exports.skip = function() {
	if (isConnected()) {
		// Stop the player
		// * The player will play the next song automatically *
		information.subscription.player.stop();
	}
};

/**
 * Validate a given URL.
 */
const validateURL = exports.validateURL = function(possibleUrl) {
	return ytdl.validateURL(possibleUrl);
};

/**
 * Remove a specific Video at the index
 * @param {Number} index
 */
exports.remove = function(index, numberToRemove) {
	const VIDEOS_TO_DISPLAY = 10;
	const { videos, textChannel, client, currentVideo } = information;
	if (isConnected() && videos && videos.length > index) {
		const embed = client.tools.createEmbed();
		let removedVideos = [], message = '';

		// Removing 0 is the same as skipping
		if (index == 0) {
			removedVideos = [currentVideo];
			skip();
		}

		// Otherwise remove the element at index
		else {removedVideos = videos.splice(index, numberToRemove);}

		// Calculate how many videos are remaining from the displayed 10
		const removedRemaining = removedVideos.length - VIDEOS_TO_DISPLAY;

		// Construct the message
		removedVideos.splice(0, VIDEOS_TO_DISPLAY)
			.forEach(vid => {message = message.concat(`*${vid.title}*`, '\n');});

		// Display the removed videos
		embed.addField('Removed', message.concat(removedRemaining > 0 ? ` and ${removedRemaining} more.` : ''));
		textChannel.send({ embeds : [embed] });
	}
};

exports.queue = function() {
	const { client, videos } = information;
	if (videos.length) {
		return client.tools.buildQueue(videos)
			.addField('Total Time', `${getTime(videos)}`);
	}

};