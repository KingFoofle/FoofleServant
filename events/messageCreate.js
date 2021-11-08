const { clientId, foofleId } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const user = message.author;

		// Don't do anything with bot messages
		if (user.id === clientId) {
			return;
		}

		// Only allow Foofle to run DEBUG Commands
		if (message.author.id === foofleId) {
			const command = message.client.debugCommands.get(message.content);
			try {
				if (command) {
					command.execute(message);
				}
			}
			catch (error) {
				console.error(error);
			}
		}
	},
};