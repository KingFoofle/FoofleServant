const { RepeatMode } = require('discord-music-player');
/**
 * Execute your own command logic here!
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {String} mode The arguments passed in by the user
 */
exports.execute = async (client, message, mode) => {
	const { player, tools } = client;
	const queue = player.getQueue(message.guildId);
	if (!mode) mode = '';
	if (queue) {
		let repeatMode, field;
		const reply = tools.createEmbed();
		switch (mode.trim()) {
		// Synonyms for off
		case 'disable':
		case 'stop':
		case 'off':
			repeatMode = RepeatMode.DISABLED;
			field = { name: 'Looping Disabled', value: 'Disabled Song Looping.' };
			break;

		case 'song':
			repeatMode = RepeatMode.SONG;
			field = { name: 'Now looping: Song', value: 'The current song will now loop' };
			break;

		case 'queue':
			repeatMode = RepeatMode.QUEUE;
			field = { name: 'Now looping: Queue', value: 'The queue will now loop' };
			break;

		default:
			// Toggle the queue
			// eslint-disable-next-line no-case-declarations
			const bool = queue.repeatMode === RepeatMode.DISABLED;
			field = { name: 'Looping Toggled' };
			repeatMode = bool ? RepeatMode.QUEUE : RepeatMode.DISABLED;
			field.value = bool ? 'The queue will now loop' : 'Disabled song looping';
		}

		queue.setRepeatMode(repeatMode);
		reply.addField(...Object.values(field));
		message.reply({ embeds: [reply] });
	}
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
exports.canBeUsedBy = (client, member) => {
	if (!client.tools.isConnectedToVoiceChannel(member)) {
		return 'Not Connected to a Voice Channel!';
	}
};

exports.description = 'Toggle Queue repetition.\nSupported modes: disable, stop, off, song, queue';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$repeat (Repeat_Mode)';