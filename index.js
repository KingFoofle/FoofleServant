// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js'),
	fs = require('fs'),
	util = require('util'),
	readdir = util.promisify(fs.readdir),
	{ Player } = require('discord-music-player'),

	// Mongoose Setup
	mongoose = require('mongoose'),

	/**
	 * Create a new client instance
	 * @type {Client}
	 */
	client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Intents.FLAGS.GUILD_BANS,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		],

		// Partials this bot can receive
		partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	}).on('error', (err) => console.error(err));


// Adding to the Client
client.env = process.env;
client.commands = new Collection();
client.tools = require('./Tools/tools.js');
client.constants = require('./Tools/constants.js');
client.logger = require('./Tools/logger.js');
client.database = require('./Database/Mongoose.js');
client.formatter = require('@discordjs/builders');

async function init() {
	const { logger, env } = client,

		/**
		* Load all files in a directory
		* @param {String} directory The directory to traverse over
		* @returns {Collection<String>} A Collection that maps the file name to its module export
		*/
		loadFiles = (directory) => {
			const data = new Collection();
			// Load Files
			const files = fs
				.readdirSync(`./${directory}`)
				.filter((file) => file.endsWith('.js'));

			logger.load(`Loading Folder: ${directory}...`);

			for (const file of files) {
				const moduleExport = require(`./${directory}/${file}`);
				const fileName = file.split('.')[0];
				logger.load(`Loading File: ${fileName}...`);
				data.set(fileName, moduleExport);
			}

			return data;
		};

	// * Load the commands
	const commandFolders = await readdir('./Commands/');
	commandFolders.forEach(type => {
		const commandFiles = loadFiles('Commands/' + type);
		client.commands.set(type, commandFiles);
		console.log('===================');
	});

	// * Load events
	loadFiles('Events/Client').forEach((event, eventName) => {
		// Attach the client to the event
		if (event.once) { client.once(eventName, event.bind(null, client)); }
		else { client.on(eventName, event.bind(null, client)); }
	});

	console.log('===================');

	// Create the Player
	const player = new Player(client)
		.on('error', (error) => {
			logger.error(`Error: ${error}`);
		});

	// * Load Player Events and assign them to the player
	loadFiles('Events/Player').forEach((event, eventName) => {
		player.on(eventName, event.bind(null, client));
	});


	// Assign the Player to the Discord Client
	client.player = player;

	console.log('===================');

	// Let the database connect BEFORE we connect to Discord
	logger.load('Connecting Mongoose...');
	mongoose.connect(env.MONGO_URI)
		.then(() => {
			logger.success('Mongoose has been connected.');

			// Login to Discord with your client's token
			client.login(env.CLIENT_TOKEN);
		})
		.catch(console.error);

}

init();