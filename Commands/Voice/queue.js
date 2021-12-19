module.exports.execute = async (client, message) => {
	const queueEmbed = client.music.queue();
	if (queueEmbed) {return message.reply({ embeds: [queueEmbed] });}
	return message.reply('No songs in the Queue');
};