/**
 * Emitted when channel was empty.
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord-music-player').Queue} queue The Song Queue
 */
module.exports = async (client, queue) => {
	const { message } = queue.data,
		embed = client.tools.createEmbed()
			.setTitle('Disconnected')
			.addField('Reason', 'Everyone left the Voice Channel');

	message.channel.send({ embeds:[embed] });
};