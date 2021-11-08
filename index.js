// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

client.buttonCommands = new Collection();
const buttonFiles = fs
	.readdirSync('./commands/buttonCommands')
	.filter((file) => file.endsWith('.js'));

client.debugCommands = new Collection();
const debugFiles = fs
	.readdirSync('./commands/debugCommands')
	.filter((file) => file.endsWith('.js'));

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of buttonFiles) {
	const command = require(`./commands/buttonCommands/${file}`);
	client.buttonCommands.set(command.buttonName, command);
}

for (const file of debugFiles) {
	const command = require(`./commands/debugCommands/${file}`);
	client.debugCommands.set(command.name, command);
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
