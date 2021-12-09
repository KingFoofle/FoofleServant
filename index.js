// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js'),
	fs = require('fs'),
	util = require('util'),
	readdir = util.promisify(fs.readdir);

// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

// Mongoose Setup
const mongoose = require('mongoose');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Adding to the Client
client.commands = new Collection();
client.event = new Collection();
client.schemas = new Collection();
client.tools = require('./Tools/tools.js');
client.logger = require('./Tools/logger.js');
client.database = require('./Database/Mongoose.js');
client.env = process.env;

async function loadFiles(directory) {
	const data = new Collection();
	// Load Files
	const files = fs
		.readdirSync(`./${directory}`)
		.filter((file) => file.endsWith('.js'));

	client.logger.load(`Loading ${directory}...`);

	for (const file of files) {
		const object = require(`./${directory}/${file}`);
		const objectName = file.split('.')[0];
		client.logger.load(`Attempting to Load: ${objectName}...`);
		data.set(objectName, object);
	}

	return data;

}

async function connectMongoose() {
	client.logger.load('Connecting Mongoose...');
	await mongoose.connect(client.env.MONGO_URI);
	client.logger.success('Mongoose has been connected.');
}

async function init() {

	// Load the commands
	const commandFolders = await readdir('./Commands/');
	commandFolders.forEach(type => {
		// Group Commands by types
		client.commands.set(type, new Collection());
		client.logger.load(`Loading ${type} Commands...`);

		// Grab all files that end with ".js"
		const commandFiles = fs.readdirSync('./Commands/' + type + '/').filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./Commands/${type}/${file}`);
			const commandName = file.split('.')[0];
			client.logger.load(`Attempting to Load Command: ${commandName}...`);
			client.commands.get(type).set(commandName, command);
		}

		console.log('===================');
	});

	// Load events
	const eventData = await loadFiles('Events');
	eventData.forEach((event, eventName) => {
		// Attach the event to the client
		if (event.once) { client.once(eventName, event.bind(null, client)); }
		else { client.on(eventName, event.bind(null, client)); }
	});

	console.log('===================');

	// Load Schemas
	client.schemas = loadFiles('Database/Schema');
	console.log('===================');

	try {
		// We await so that the Database is ready BEFORE we connect to Discord
		await connectMongoose();

		// Login to Discord with your client's token
		client.login(process.env.CLIENT_TOKEN);
	}
	catch (err) {
		client.logger.error(`An error occured: \n${err}`);
	}
}

init();