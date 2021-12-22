/**
 * Emitted when someone disconnected the bot from the channel.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 */
module.exports = async (client, queue) => {
	client.logger.log('I was kicked from the Voice Channel, queue ended.');
};