/**
 * Emitted when the Client connects to a voice channel
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 * @param {import('discord.js').VoiceChannel} channel The Voice Channel that the bot connected to
 */
module.exports = async (client, queue, channel) => {
	const embed = client.tools.createEmbed()
		.setTitle('Connected')
		.addField('Channel Name', channel.name, true)
		.addField('Members', (channel.members.size - 1).toString(), true);

	queue.data.message.channel.send({ embeds: [embed] });
};