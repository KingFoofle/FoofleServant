// Run this file EVERY TIME you want to update a slash command
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./Commands/Slash').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./Commands/Slash/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered Slash commands.'))
	.catch(console.error);