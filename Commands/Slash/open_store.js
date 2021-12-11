const { SlashCommandBuilder } = require('@discordjs/builders');

exports.data = new SlashCommandBuilder()
	.setName('open_store')
	.setDescription('Opens the Interactive Store');


// TODO:
// Build the Interactive Ephemeral message and send it
exports.execute = async (client, interaction) => {
	const { productSchema: storeDB } = client.database;
	const products = await storeDB.find({});

};