// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js'),
	fs = require('fs'),
	util = require('util'),
	readdir = util.promisify(fs.readdir),

	// Mongoose Setup
	mongoose = require('mongoose'),

	/**
	 * Create a new client instance
	 * @type {Client}
	 */
	client = new Client({
		intents: [
		// [] = Unused, [x] = Used

			// Gives the bot like, 80 events, but we need it to be able to access
			// channel and message cache
			Intents.FLAGS.GUILDS,

			/* Gives the bot access to these events:
				- MESSAGE_CREATE 									[x]
				- MESSAGE_UPDATE 									[]
				- MESSAGE_DELETE 									[]
				- MESSAGE_DELETE_BULK 						[]
			 */
			Intents.FLAGS.GUILD_MESSAGES,

			/* Gives the bot access to these events:
				- MESSAGE_REACTION_ADD 						[x]
				- MESSAGE_REACTION_REMOVE					[]
				- MESSAGE_REACTION_REMOVE_ALL			[]
				- MESSAGE_REACTION_REMOVE_EMOJI		[]
			*/
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,

			/* Gives the bot access to these events:
				- GUILD_BAN_ADD 									[x]
				- GUILD_BAN_REMOVE								[]
			*/
			Intents.FLAGS.GUILD_BANS,

			/* Gives the bot access to these events:
				- VOICE_STATE_UPDATE							[]
			*/
			Intents.FLAGS.GUILD_VOICE_STATES,

			/* Gives the bot access to these events:
				  - GUILD_EMOJIS_UPDATE						[]
  				- GUILD_STICKERS_UPDATE					[]
			*/
			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		],

		// Partials this bot can receive
		partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	});


// Adding to the Client
client.env = process.env;
client.commands = new Collection();
client.event = new Collection();
client.tools = require('./Tools/tools.js');
client.constants = require('./Tools/constants.js');
client.logger = require('./Tools/logger.js');
client.database = require('./Database/Mongoose.js');
client.formatter = require('@discordjs/builders');
client.player = require('./Tools/player.js').getPlayer(client);


async function init() {
	const { logger, env } = client,

		/**
		*
		* @param {String} directory The directory to traverse over
		* @returns {Collection<String>} A Collection that maps the file name to its module export
		*/
		loadFiles = function(directory) {
			const data = new Collection();
			// Load Files
			const files = fs
				.readdirSync(`./${directory}`)
				.filter((file) => file.endsWith('.js'));

			logger.load(`Loading ${directory}...`);

			for (const file of files) {
				const moduleExport = require(`./${directory}/${file}`);
				const fileName = file.split('.')[0];
				logger.load(`Attempting to Load: ${fileName}...`);
				data.set(fileName, moduleExport);
			}

			return data;
		};

	// Load the commands
	const commandFolders = await readdir('./Commands/');
	commandFolders.forEach(type => {
		const commandFiles = loadFiles('Commands/' + type);
		client.commands.set(type, commandFiles);
		console.log('===================');
	});

	// Load events
	const eventData = loadFiles('Events');
	eventData.forEach((event, eventName) => {
		// Attach the event to the client
		if (event.once) { client.once(eventName, event.bind(null, client)); }
		else { client.on(eventName, event.bind(null, client)); }
	});

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