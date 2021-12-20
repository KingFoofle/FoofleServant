/**
 * Display the Music Queue of the Bot
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 */
exports.execute = async (client, message) => {
	const queueEmbed = client.music.queue();
	if (queueEmbed) {return message.reply({ embeds: [queueEmbed] });}
	return message.reply('No songs in the Queue');
};

/**
 * Define the restrictions of who can use this command
 * @param {import('discord.js').Client} client The Discord Client
 * @param {import('discord.js').GuildMember} member The member to check against the restrictions
 * @returns {void | string} `reason` explaining why the member cannot use this command. `void` otherwise
 */
// eslint-disable-next-line no-unused-vars
exports.canBeUsedBy = (client, member) => {
	// Anyone can use this command
};