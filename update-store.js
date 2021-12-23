// * This File is to be ran when an update to the store is made *

const Product = require('./Database/Schema/Product.js'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	{ colors } = require('./Tools/constants');

// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

async function update() {
	console.log('Connecting to Mongoose...');
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected to Mongoose!');
	console.log('======================\nUpdating Products...');

	for (const product of products) {
		// Update, or create a new product
		await Product.findByIdAndUpdate(product._id, product, { upsert:true });

		const content = ['/**',
			'\t* Execute the logic that should be run when the user buys this Product',
			'\t* @param {import(\'discord.js\').Client} client The Discord Client',
			'\t* @param {import(\'discord.js\').ButtonInteraction} interaction The Button Interaction triggered by the Member',
			'\t* @param {import(\'mongoose\').Model} product The Product that the Member purchased',
			'*/',
			'module.exports.execute = async (client, interaction, product) => {',
			'\tconst { member } = interaction,',
			'\t\t{ _id: productName } = product;',
			'\t// Return \'reason\' only if the command fails, and the user will not be charged',
			'\t return { reason: \'Function Not Implemented };\' ',
			'};'];

		// Create the file if it does not exist
		// ! The execute() method that should be ran when the user purchases
		// ! the product should go in that file
		fs.writeFile(`./Commands/Product/${product._id}.js`, content.join('\n'),
			{ flag: 'wx' }, (err) => {if (err) {console.log(`${product._id} already exists.`);}},
		);
	}

	console.log(`Updated ${products.length} products`);
	setTimeout(() => process.exit(), 5000);
}

/**
 * Generate a Product for each color in the parameter
 * @param {String[]} colors
 * @returns {Product[]}
 */
function generateColorProducts() {
	const toReturn = [];
	colors.forEach(color => toReturn.push(
		new Product({
			_id: `${color}Nickname`,
			description: `Give your nickname a vibrant ${color} color!`,
			price: 1000,
		}),
	));

	return toReturn;
}

// * Products * //
const products = [


].concat(generateColorProducts());

update();

