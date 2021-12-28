/**
 * Emitted when channel was empty.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 */
module.exports = async (client, queue) => {
	const embed = client.tools.createEmbed()
		.setTitle('Disconnected')
		.addField('Reason', 'Everyone left the Voice Channel');

	queue.data.message.channel.send({ embeds:[embed] });
};