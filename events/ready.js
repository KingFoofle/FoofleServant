module.exports = async (client) => {
	client.logger.ready(`Ready! Logged in as ${client.user.tag}`);

	let status, activity, type;
	if (client.env.PRODUCTION_MODE) {
		status = 'dnd';
		activity = 'Foofle is performing maintenance on me.';
		type = 'WATCHING';
	}
	else {
		status = 'online';
		activity = 'Feeling great! Type $help for a list of commands';
		type = 'PLAYING';
	}

	client.user.setStatus(status);
	client.user.setActivity(activity, { type: type });
};

module.exports.once = true;