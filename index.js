// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js'),
	fs = require('fs'),
	util = require('util'),
	readdir = util.promisify(fs.readdir);

// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

// MongoDB Setup
const { MongoClient } = require('mongodb');
const mongoClient = new MongoClient(process.env.MONGO_URI);

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Adding to the Client
client.commands = new Collection();
client.event = new Collection();
client.tools = require('./Tools/tools.js');
client.logger = require('./Tools/logger.js');
client.env = process.env;
client.mongoClient = mongoClient;

async function connectMongoDB() {
	client.logger.load('Connecting to MongoDB Database...');
	// Connect to MongoDB
	await mongoClient.connect();

	client.logger.success('Connected to MongoDB.');

	// If we want to connect to database "Delta" and Collection "Oof"
	// we would write:
	// mongoClient.db("Delta").collection("Oof")
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
	const eventFiles = fs
		.readdirSync('./Events')
		.filter((file) => file.endsWith('.js'));

	client.logger.load('Loading Events...');

	for (const file of eventFiles) {
		const event = require(`./Events/${file}`);
		const eventName = file.split('.')[0];
		client.logger.load(`Attempting to Load Event: ${eventName}...`);

		// Attach the event to the client
		if (event.once) { client.once(eventName, event.bind(null, client)); }
		else { client.on(eventName, event.bind(null, client)); }

	}

	console.log('===================');

	try {
		connectMongoDB();

		// Login to Discord with your client's token
		client.login(process.env.CLIENT_TOKEN);
	}
	catch (err) {
		client.logger.error(`An error occured: \n${err}`);
	}
}

init();