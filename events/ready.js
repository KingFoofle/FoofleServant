module.exports = async (client) => {
	client.logger.ready(`Ready! Logged in as ${client.user.tag}`);
}

module.exports.once = true;