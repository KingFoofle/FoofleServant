const { logChannelId } = require('../config.json');

function logToAdminChannel(interaction, message) {
	// Maybe use a constant time zone?
	message = `*${new Date().toLocaleString()}:*\n${message}`;
	interaction.client.channels.cache.get(logChannelId).send(message);
}

module.exports = {
	logToAdminChannel: logToAdminChannel,
};