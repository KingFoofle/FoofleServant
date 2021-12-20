/**
* Emitted whenever a member is banned from a guild.
* @param {import('discord.js').Client} client The Discord Client
* @param {import('discord.js').GuildBan} ban The ban that occurred
*/
module.exports = async (client, ban) => {
	const { userSchema: userDB } = client.database;
	const { logger } = client;

	try {
		// Remove the user from the database
		const user = await userDB.findByIdAndRemove(ban.user.id);
		logger.log(`Removed ${user.username} from MongoDB.`);
	}
	catch (err) {logger.error(err);}
};