// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Read all of the commands from the /commands directory
// Only include the .js files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Read all of the button commands from the /commands/buttonCommands directory
// Only include the .js files
client.buttonCommands = new Collection();
const buttonFiles = fs.readdirSync('./commands/buttonCommands').filter(file => file.endsWith('.js'));

// Read all of the events from the /events directory
// Only include the .js files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of buttonFiles) {
	const command = require(`./commands/buttonCommands/${file}`);
	client.buttonCommands.set(command.buttonName, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);