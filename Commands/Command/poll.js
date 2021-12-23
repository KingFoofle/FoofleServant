const { MessageAttachment } = require('discord.js');

/**
 * Execute your own command logic here!
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {...any} pollPrompt The arguments passed in by the user
 */
exports.execute = async (client, message, ...pollPrompt) => {
	const embedReply = client.tools.createEmbed();
	const foofId = client.env.OWNER_ID;

	// No question was given
	if (!pollPrompt || !pollPrompt.join(' ').trim()) {
		embedReply.addField('Poll unsuccessful', 'No poll question was given');
		return message.reply({ embeds: [embedReply] });
	}

	const pollQuestion = pollPrompt.join(' ').trim();
	embedReply.setTitle('A poll has begun!')
		.addField(message.author.username + ' asked', client.formatter.italic(pollQuestion))
		.addField('\u200B', 'The poll will last 1 hour');

	const msg = await message.channel.send({ embeds:[embedReply] });
	const collector = msg.createReactionCollector({
		// Only Foof can stop the poll
		filter: (r, u) => r.emoji.name !== '🛑' || u.id === foofId,

		// Run for 1 hour
		time: 1000 * 60 * 60,
	})
		.on('collect', r => {
			if (r.emoji.name === '🛑') {collector.stop('🛑 was pressed by Foofle');}
		})

		.on('end', (collected) => {
			const yes = collected.get('✅').count - 1;
			const no = collected.get('❌').count - 1;
			const embed = client.tools.createEmbed()
				.setTitle('The Poll has ended')
				.addFields([
					{ name: 'Question', value: pollQuestion },
					{ name: 'Yes (✅)', value: yes.toString(), inline: true },
					{ name: 'No (❌)', value: no.toString(), inline: true },
				]);

			// If no one reacted
			if (!(yes + no)) {
				const file = new MessageAttachment('./Resources/Normal_and_Dark_Traumatized_Mr._Incredible_Meme_Template.jpeg');
				embed.addField('\u200B', '\u200B')
					.setImage('attachment://Normal_and_Dark_Traumatized_Mr._Incredible_Meme_Template.jpeg');
				return message.reply({ embeds: [embed], files:[file] });
			}

			if (yes > no) {embed.addField('\u200B', '🎉 The majority agrees! 🎉');}

			else if (yes === no) {
				embed.addField('\u200B', '\u200B')
					.setImage('https://c.tenor.com/ZjqPAZpKWAUAAAAC/the-road-to-el-dorado-both.gif');
			}

			else {embed.addField('\u200B', '👎 The majority disagrees! 👎');}

			message.reply({ embeds: [embed] });
		});

	await msg.react('✅');
	await msg.react('❌');
	await msg.react('🛑');


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