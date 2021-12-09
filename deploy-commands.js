// Run this file EVERY TIME you want to update a slash command
const fs = require('fs'),
	{ REST } = require('@discordjs/rest'),
	{ Routes } = require('discord-api-types/v9');

// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();
const envVars = process.env;

const commands = [];
const commandFiles = fs.readdirSync('./Commands/Slash').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./Commands/Slash/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(envVars.CLIENT_TOKEN);

rest.put(Routes.applicationGuildCommands(envVars.CLIENT_ID, envVars.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered Slash commands.'))
	.catch(console.error);