const { menu } = require('discord.js-reaction-menu');

const sendHelpMenu = (client, message) => {
	let pageCount = 1;

	// The pages of the Help Menu, already containing the first page.
	const pages = [
		client.tools.createEmbed()
			.setTitle('Welcome to the Help Menu!')
			.addField('How to use',
				'In the following pages you will see a list of commands that you can use. To get help for a certain command, type' +
				client.formatter.codeBlock(this.usage))];

	// What command types should be displayed in the help menu
	const { acceptedCommandTypes } = client.constants;

	// How many commands should be displayed per page
	const commandsPerPage = 10;

	// Calculate how many pages we will be using
	const pageTotal = client.commands
		.reduce((number, commandList, typeName) => {
			if (acceptedCommandTypes.includes(typeName)) {
				return number + Math.ceil(commandList.size / commandsPerPage);
			}
			return number;
		}, 0);

	// Build the pages
	client.commands.forEach((commands, typeName) => {
		if (acceptedCommandTypes.includes(typeName)) {
			let i = 0;
			// Build a page for every 10 commands
			while (i < commands.size) {
				const sliced = [...commands.keys()].slice(i, i + commandsPerPage),
					cmdNames = sliced.reduce((prevValue, curValue) => prevValue + curValue + '\n', ''),
					page = client.tools.createEmbed()
						.setTitle('Help Menu')
						.addField(typeName, cmdNames)
						.setFooter(`Page ${pageCount++} of ${pageTotal}`);

				pages.push(page);
				i += commandsPerPage;
			}
		}
	});

	// Create and send the page
	new menu({
		channel: message.channel,
		userID: message.author.id,
		pages: pages,
		// 5 minutes
		time: 1000 * 60 * 5,
	});
};

/**
 * Execute your own command logic here!
 * @param {import('discord.js').Client)} client The Discord Client
 * @param {import('discord.js').Message} message The message that triggered the command
 * @param  {...any} otherArgs The arguments passed in by the user
 */
exports.execute = async (client, message, commandName) => {
	const { acceptedCommandTypes } = client.constants;
	// The user called $help instead of $help (commandName)
	if (!commandName) {return sendHelpMenu(client, message);}

	// Check to see if the command exists
	for (const cmdType of acceptedCommandTypes) {
		const command = client.commands.get(cmdType).get(commandName);
		if (command) {
			const description = command.description ? command.description : 'No Description Provided';
			const usage = command.usage ? command.usage : client.env.PREFIX + commandName;
			const reply = client.tools.createEmbed()
				.setTitle(`Help for Command ${commandName}`)
				.addField('Description', client.formatter.italic(description))
				.addField(
					'Usage',
					'[] = Required Argument\n() = Optional Argument\n\n' +
					client.formatter.codeBlock(usage),
				);

			return message.reply({ embeds: [reply] });
		}
	}


};

exports.description = 'Access the Help Menu.';

/**
 * How the user should 'call' the command. This is used in the 'help' command
 */
exports.usage = '$help (Command_Name)';