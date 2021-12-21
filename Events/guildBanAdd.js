/**
* Emitted whenever a member is banned from a guild.
* @param {import('discord.js').Client} client The Discord Client
* @param {import('discord.js').GuildBan} ban The ban that occurred
*/
module.exports = async (client, ban) => {
	const { userSchema: userDB } = client.database;
	const { logger } = client;

	// Remove the user from the database
	userDB.findByIdAndRemove(ban.user.id)
		.then(user => logger.log(`Removed ${user.username} from MongoDB.`))
		.catch(err => logger.error(err));

};